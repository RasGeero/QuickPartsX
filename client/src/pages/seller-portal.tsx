import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPartSchema } from "@shared/schema";
import { z } from "zod";
import type { Part, UserWithStats } from "@shared/schema";

const partFormSchema = insertPartSchema.extend({
  images: z.array(z.any()).optional(),
});

type PartFormData = z.infer<typeof partFormSchema>;

export default function SellerPortal() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPart, setEditingPart] = useState<Part | null>(null);

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

  const form = useForm<PartFormData>({
    resolver: zodResolver(partFormSchema),
    defaultValues: {
      name: '',
      description: '',
      carModel: '',
      condition: 'new',
      price: '',
      images: [],
    },
  });

  const { data: userParts = [], isLoading: partsLoading } = useQuery<Part[]>({
    queryKey: ['/api/seller', user?.id, 'parts'],
    enabled: !!user?.id && isAuthenticated,
    retry: false,
  });

  const createPartMutation = useMutation({
    mutationFn: async (data: PartFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach(file => formData.append('images', file));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      return apiRequest('POST', '/api/parts', formData);
    },
    onSuccess: () => {
      toast({
        title: "Part listed successfully",
        description: "Your part has been added to the marketplace.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/seller', user?.id, 'parts'] });
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
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePartMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PartFormData> }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach(file => formData.append('images', file));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      return apiRequest('PATCH', `/api/parts/${id}`, formData);
    },
    onSuccess: () => {
      toast({
        title: "Part updated successfully",
        description: "Your listing has been updated.",
      });
      setEditingPart(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/seller', user?.id, 'parts'] });
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
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePartMutation = useMutation({
    mutationFn: async (partId: string) => {
      return apiRequest('DELETE', `/api/parts/${partId}`);
    },
    onSuccess: () => {
      toast({
        title: "Part deleted",
        description: "Your listing has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/seller', user?.id, 'parts'] });
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
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { sellerType: string; businessName?: string; location: string; phoneNumber: string; whatsappNumber?: string }) => {
      return apiRequest('PATCH', '/api/auth/user', data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your seller profile has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
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
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PartFormData) => {
    if (editingPart) {
      updatePartMutation.mutate({ id: editingPart.id, data });
    } else {
      createPartMutation.mutate(data);
    }
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    form.reset({
      name: part.name,
      description: part.description || '',
      carModel: part.carModel,
      condition: part.condition,
      price: part.price || '',
      images: [],
    });
  };

  const handleCancelEdit = () => {
    setEditingPart(null);
    form.reset();
  };

  const handleDelete = (partId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      deletePartMutation.mutate(partId);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Show profile setup if user hasn't set up seller profile
  if (user && !user.sellerType) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Seller Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  updateProfileMutation.mutate({
                    sellerType: formData.get('sellerType') as string,
                    businessName: formData.get('businessName') as string,
                    location: formData.get('location') as string,
                    phoneNumber: formData.get('phoneNumber') as string,
                    whatsappNumber: formData.get('whatsappNumber') as string,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Seller Type</label>
                  <select 
                    name="sellerType" 
                    required 
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring"
                    data-testid="select-seller-type"
                  >
                    <option value="">Select Seller Type</option>
                    <option value="private">Private Seller</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                
                <Input
                  name="businessName"
                  placeholder="Business Name (optional for private sellers)"
                  data-testid="input-business-name"
                />
                
                <Input
                  name="location"
                  placeholder="Location (Area, City)"
                  required
                  data-testid="input-location"
                />
                
                <Input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  required
                  data-testid="input-phone"
                />
                
                <Input
                  name="whatsappNumber"
                  placeholder="WhatsApp Number (optional)"
                  data-testid="input-whatsapp"
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-setup-profile"
                >
                  {updateProfileMutation.isPending ? 'Setting up...' : 'Set Up Seller Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Seller Portal</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{(user as any)?.totalListings || 0}</div>
              <div className="text-muted-foreground">Active Listings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-success">{(user as any)?.totalRatings || 0}</div>
              <div className="text-muted-foreground">Total Reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-secondary">
                {(user as any)?.averageRating ? (user as any).averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Part Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingPart ? 'Edit Part Listing' : 'Add New Part Listing'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Part Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Brake Disc Set" {...field} data-testid="input-part-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="carModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Car Model Compatibility</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Toyota Corolla 2015-2020" {...field} data-testid="input-car-model" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-condition">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (GHS)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="450" {...field} value={field.value || ''} data-testid="input-price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the part, its condition, warranty, etc."
                          rows={3}
                          {...field}
                          value={field.value || ''}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photos (up to 3)</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || []}
                          onChange={field.onChange}
                          maxFiles={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-2">
                  <Button 
                    type="submit"
                    disabled={createPartMutation.isPending || updatePartMutation.isPending}
                    data-testid="button-submit-part"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    {editingPart 
                      ? (updatePartMutation.isPending ? 'Updating...' : 'Update Listing')
                      : (createPartMutation.isPending ? 'Adding...' : 'Add Listing')
                    }
                  </Button>
                  
                  {editingPart && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Current Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {partsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : userParts.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-box-open text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground">Create your first listing using the form above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userParts.map((part) => (
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
                        <p className="text-sm text-muted-foreground">{part.carModel}</p>
                        <p className="text-sm font-medium text-primary">
                          {part.price ? `GHS ${part.price}` : 'Price not set'}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(part)}
                        data-testid={`button-edit-${part.id}`}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(part.id)}
                        disabled={deletePartMutation.isPending}
                        data-testid={`button-delete-${part.id}`}
                      >
                        <i className="fas fa-trash text-destructive"></i>
                      </Button>
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
