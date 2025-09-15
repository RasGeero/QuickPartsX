import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import PartCard from "@/components/part-card";
import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { UserWithStats, Part } from "@shared/schema";

export default function SellerProfile() {
  const { sellerId } = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: seller, isLoading: sellerLoading, error: sellerError, refetch: refetchSeller } = useQuery<UserWithStats>({
    queryKey: ['/api/seller', sellerId],
    enabled: !!sellerId,
  });

  const { data: sellerParts = [], isLoading: partsLoading, error: partsError, refetch: refetchParts } = useQuery<Part[]>({
    queryKey: ['/api/seller', sellerId, 'parts'],
    enabled: !!sellerId,
  });

  const ratingMutation = useMutation({
    mutationFn: async ({ rating }: { rating: number }) => {
      return apiRequest('POST', '/api/ratings', {
        sellerId,
        rating,
      });
    },
    onSuccess: () => {
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/seller', sellerId] });
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
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCall = () => {
    if (seller?.phoneNumber) {
      window.location.href = `tel:${seller.phoneNumber}`;
    } else {
      toast({
        title: "No phone number",
        description: "This seller hasn't provided a phone number.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = () => {
    if (seller?.whatsappNumber) {
      window.open(`https://wa.me/${seller.whatsappNumber.replace(/\D/g, '')}`, '_blank');
    } else if (seller?.phoneNumber) {
      window.open(`https://wa.me/${seller.phoneNumber.replace(/\D/g, '')}`, '_blank');
    } else {
      toast({
        title: "No WhatsApp number",
        description: "This seller hasn't provided a WhatsApp number.",
        variant: "destructive",
      });
    }
  };

  const handleChat = () => {
    toast({
      title: "Chat feature coming soon",
      description: "In-app chat will be available in the next update.",
    });
  };

  const handleRating = (rating: number) => {
    ratingMutation.mutate({ rating });
  };

  if (sellerError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
              <h2 className="text-xl font-semibold mb-2">Failed to load seller</h2>
              <p className="text-muted-foreground mb-4">
                {sellerError instanceof Error ? sellerError.message : 'Something went wrong while fetching seller information'}
              </p>
              <Button onClick={() => refetchSeller()} data-testid="button-retry-seller">
                <i className="fas fa-redo mr-2"></i>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (authLoading || sellerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-48 w-full rounded-lg mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <i className="fas fa-user-slash text-4xl text-muted-foreground mb-4"></i>
              <h2 className="text-xl font-semibold mb-2">Seller not found</h2>
              <p className="text-muted-foreground">The seller you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Seller Header */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                {seller.businessName 
                  ? seller.businessName.substring(0, 2).toUpperCase()
                  : `${seller.firstName?.[0] || ''}${seller.lastName?.[0] || ''}`.toUpperCase() || 'U'
                }
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold" data-testid="text-seller-name">
                    {seller.businessName || `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'Unknown Seller'}
                  </h1>
                  {seller.isVerified && (
                    <i className="fas fa-check-circle text-success" title="Verified Seller"></i>
                  )}
                </div>
                <p className="text-muted-foreground" data-testid="text-seller-type">
                  <i className={`fas ${seller.sellerType === 'business' ? 'fa-store' : 'fa-user'} mr-1`}></i>
                  {seller.sellerType === 'business' ? 'Business' : 'Private'} Seller
                </p>
                {seller.location && (
                  <p className="text-muted-foreground" data-testid="text-seller-location">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {seller.location}
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <StarRating rating={seller.averageRating} readonly />
                  <span className="ml-2 text-sm text-muted-foreground" data-testid="text-seller-rating">
                    {seller.averageRating.toFixed(1)} ({seller.totalRatings} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Contact Buttons */}
            <div className="flex flex-col space-y-2 w-full sm:w-auto">
              <Button 
                onClick={handleCall}
                className="bg-success hover:bg-success/90 text-white"
                data-testid="button-call"
              >
                <i className="fas fa-phone mr-2"></i>Call Now
              </Button>
              <Button 
                onClick={handleWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white"
                data-testid="button-whatsapp"
              >
                <i className="fab fa-whatsapp mr-2"></i>WhatsApp
              </Button>
              <Button 
                onClick={handleChat}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                data-testid="button-chat"
              >
                <i className="fas fa-comment mr-2"></i>Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Seller's Parts */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Parts by this seller ({seller.totalListings})</h2>
          {partsError ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">Failed to load parts</h3>
                <p className="text-muted-foreground mb-4">
                  {partsError instanceof Error ? partsError.message : 'Something went wrong while fetching seller parts'}
                </p>
                <Button onClick={() => refetchParts()} data-testid="button-retry-parts">
                  <i className="fas fa-redo mr-2"></i>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : partsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-lg" />
              ))}
            </div>
          ) : sellerParts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <i className="fas fa-box-open text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">No parts available</h3>
                <p className="text-muted-foreground">This seller hasn't listed any parts yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerParts.map((part) => (
                <PartCard 
                  key={part.id} 
                  part={{
                    ...part,
                    seller: {
                      id: seller.id,
                      businessName: seller.businessName,
                      firstName: seller.firstName,
                      lastName: seller.lastName,
                      sellerType: seller.sellerType,
                      location: seller.location,
                      isVerified: seller.isVerified,
                    }
                  }} 
                  viewMode="grid"
                  showSellerInfo={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rating Section */}
        {user?.id !== sellerId && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Leave a Rating</h3>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-muted-foreground">Rate this seller:</span>
              <StarRating 
                rating={0} 
                onRatingChange={handleRating}
                disabled={ratingMutation.isPending}
              />
            </div>
            {ratingMutation.isPending && (
              <p className="text-sm text-muted-foreground">Submitting rating...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
