import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UserWithStats, PartWithSeller } from "@shared/schema";

export default function AdminPanel() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (!authLoading && isAuthenticated && user && !user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: sellers = [], isLoading: sellersLoading, error: sellersError, refetch: refetchSellers } = useQuery<UserWithStats[]>({
    queryKey: ['/api/admin/sellers'],
    enabled: !!user?.isAdmin && isAuthenticated,
    retry: false,
  });

  const { data: allParts = [], isLoading: partsLoading, error: partsError, refetch: refetchParts } = useQuery<PartWithSeller[]>({
    queryKey: ['/api/admin/parts'],
    enabled: !!user?.isAdmin && isAuthenticated,
    retry: false,
  });

  const verifySellerMutation = useMutation({
    mutationFn: async ({ sellerId, isVerified }: { sellerId: string; isVerified: boolean }) => {
      return apiRequest('PATCH', `/api/admin/sellers/${sellerId}/verify`, { isVerified });
    },
    onSuccess: () => {
      toast({
        title: "Seller updated",
        description: "Seller verification status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sellers'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update seller. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeSellerMutation = useMutation({
    mutationFn: async (sellerId: string) => {
      return apiRequest('DELETE', `/api/admin/sellers/${sellerId}`);
    },
    onSuccess: () => {
      toast({
        title: "Seller removed",
        description: "The seller has been removed from the platform.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sellers'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to remove seller. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleVerification = (sellerId: string, isCurrentlyVerified: boolean) => {
    verifySellerMutation.mutate({ sellerId, isVerified: !isCurrentlyVerified });
  };

  const handleRemoveSeller = (sellerId: string, sellerName: string) => {
    if (confirm(`Are you sure you want to remove ${sellerName}? This action cannot be undone.`)) {
      removeSellerMutation.mutate(sellerId);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <i className="fas fa-shield-alt text-4xl text-muted-foreground mb-4"></i>
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You need admin privileges to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const verifiedSellers = sellers.filter(s => s.isVerified).length;
  const pendingSellers = sellers.filter(s => !s.isVerified).length;
  const activeParts = allParts.filter(p => p.isActive).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        
        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary" data-testid="stat-total-sellers">
                {sellers.length}
              </div>
              <div className="text-muted-foreground">Total Sellers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-success" data-testid="stat-verified-sellers">
                {verifiedSellers}
              </div>
              <div className="text-muted-foreground">Verified Sellers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-secondary" data-testid="stat-total-listings">
                {activeParts}
              </div>
              <div className="text-muted-foreground">Active Listings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-yellow-600" data-testid="stat-pending-reviews">
                {pendingSellers}
              </div>
              <div className="text-muted-foreground">Pending Reviews</div>
            </CardContent>
          </Card>
        </div>

        {/* Seller Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seller Management</CardTitle>
          </CardHeader>
          <CardContent>
            {sellersError ? (
              <div className="text-center py-12">
                <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">Failed to load sellers</h3>
                <p className="text-muted-foreground mb-4">
                  {sellersError instanceof Error ? sellersError.message : 'Something went wrong while fetching sellers'}
                </p>
                <Button onClick={() => refetchSellers()} data-testid="button-retry-sellers">
                  <i className="fas fa-redo mr-2"></i>
                  Try Again
                </Button>
              </div>
            ) : sellersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : sellers.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-users text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">No sellers yet</h3>
                <p className="text-muted-foreground">Sellers will appear here when they register.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seller</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Listings</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellers.map((seller) => (
                      <TableRow key={seller.id} data-testid={`seller-row-${seller.id}`}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                              {seller.businessName 
                                ? seller.businessName.substring(0, 2).toUpperCase()
                                : `${seller.firstName?.[0] || ''}${seller.lastName?.[0] || ''}`.toUpperCase() || 'U'
                              }
                            </div>
                            <span className="font-medium">
                              {seller.businessName || `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'Unknown'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{seller.sellerType}</span>
                        </TableCell>
                        <TableCell>{seller.location || 'Not specified'}</TableCell>
                        <TableCell>{seller.totalListings}</TableCell>
                        <TableCell>
                          {seller.averageRating > 0 
                            ? `${seller.averageRating.toFixed(1)} (${seller.totalRatings})`
                            : 'No ratings'
                          }
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            seller.isVerified 
                              ? 'bg-success/10 text-success'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            <i className={`fas ${seller.isVerified ? 'fa-check-circle' : 'fa-clock'} mr-1`}></i>
                            {seller.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVerification(seller.id, seller.isVerified ?? false)}
                              disabled={verifySellerMutation.isPending}
                              title={seller.isVerified ? 'Revoke Verification' : 'Verify Seller'}
                              data-testid={`button-toggle-verification-${seller.id}`}
                            >
                              <i className={`fas ${seller.isVerified ? 'fa-user-times text-yellow-600' : 'fa-user-check text-success'}`}></i>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSeller(
                                seller.id, 
                                seller.businessName || `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'this seller'
                              )}
                              disabled={removeSellerMutation.isPending}
                              title="Remove Seller"
                              data-testid={`button-remove-${seller.id}`}
                            >
                              <i className="fas fa-trash text-destructive"></i>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {partsError ? (
              <div className="text-center py-12">
                <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">Failed to load listings</h3>
                <p className="text-muted-foreground mb-4">
                  {partsError instanceof Error ? partsError.message : 'Something went wrong while fetching listings'}
                </p>
                <Button onClick={() => refetchParts()} data-testid="button-retry-parts">
                  <i className="fas fa-redo mr-2"></i>
                  Try Again
                </Button>
              </div>
            ) : partsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : allParts.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-box-open text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground">Parts listings will appear here when sellers add them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allParts.slice(0, 10).map((part) => (
                  <div 
                    key={part.id} 
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                    data-testid={`listing-${part.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      {part.images && part.images[0] ? (
                        <img 
                          src={part.images[0]} 
                          alt={part.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <i className="fas fa-image text-muted-foreground"></i>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold">{part.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          by {part.seller.businessName || `${part.seller.firstName || ''} ${part.seller.lastName || ''}`.trim() || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Added {part.createdAt ? new Date(part.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        part.isActive 
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {part.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
