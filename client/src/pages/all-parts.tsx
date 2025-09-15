import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import PartCard from "@/components/part-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { PartWithSeller } from "@shared/schema";

export default function AllParts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    condition: 'all-conditions',
    location: 'all-locations',
    sellerType: 'all-sellers',
    maxPrice: '',
  });

  const { data: parts = [], isLoading, error, refetch } = useQuery<PartWithSeller[]>({
    queryKey: ['/api/parts', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        // Skip empty values and "all" values (which are used for UI purposes)
        if (value && !value.startsWith('all-')) params.append(key, value);
      });
      
      const response = await fetch(`/api/parts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch parts');
      return response.json();
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      condition: 'all-conditions',
      location: 'all-locations',
      sellerType: 'all-sellers',
      maxPrice: '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Auto Parts</h1>
            <p className="text-muted-foreground" data-testid="text-parts-count">
              {isLoading ? 'Loading...' : `Showing ${parts.length} parts`}
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              data-testid="button-grid-view"
            >
              <i className="fas fa-th"></i>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              data-testid="button-list-view"
            >
              <i className="fas fa-list"></i>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <Input
              placeholder="Search parts or car models..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              data-testid="input-search-filter"
            />
            
            <Select value={filters.condition} onValueChange={(value) => handleFilterChange('condition', value)}>
              <SelectTrigger data-testid="select-condition">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-conditions">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger data-testid="select-location">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All Locations</SelectItem>
                <SelectItem value="Accra">Accra</SelectItem>
                <SelectItem value="Kumasi">Kumasi</SelectItem>
                <SelectItem value="Tamale">Tamale</SelectItem>
                <SelectItem value="Cape Coast">Cape Coast</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.sellerType} onValueChange={(value) => handleFilterChange('sellerType', value)}>
              <SelectTrigger data-testid="select-seller-type">
                <SelectValue placeholder="All Sellers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-sellers">All Sellers</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="Max Price (GHS)"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              data-testid="input-max-price"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={clearFilters}
            data-testid="button-clear-filters"
          >
            Clear Filters
          </Button>
        </div>

        {/* Parts Grid/List */}
        {error ? (
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
            <h3 className="text-lg font-semibold mb-2">Failed to load parts</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Something went wrong while fetching parts'}
            </p>
            <div className="space-x-2">
              <Button onClick={() => refetch()} data-testid="button-retry">
                <i className="fas fa-redo mr-2"></i>
                Try Again
              </Button>
              <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters-error">
                Clear Filters
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-semibold mb-2">No parts found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
            <Button onClick={clearFilters} data-testid="button-clear-filters-empty">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {parts.map((part) => (
              <PartCard 
                key={part.id} 
                part={part} 
                viewMode={viewMode}
                onClick={() => setLocation(`/seller/${part.sellerId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
