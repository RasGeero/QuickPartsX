import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PartWithSeller } from "@shared/schema";

interface PartCardProps {
  part: PartWithSeller;
  viewMode?: 'grid' | 'list';
  showSellerInfo?: boolean;
  onClick?: () => void;
}

export default function PartCard({ 
  part, 
  viewMode = 'grid', 
  showSellerInfo = true, 
  onClick 
}: PartCardProps) {
  const sellerName = part.seller.businessName || 
    `${part.seller.firstName || ''} ${part.seller.lastName || ''}`.trim() || 
    'Unknown Seller';

  if (viewMode === 'list') {
    return (
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={onClick}
        data-testid={`part-card-${part.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {part.images && part.images[0] ? (
              <img 
                src={part.images[0]} 
                alt={part.name}
                className="w-24 h-24 object-cover rounded-md"
              />
            ) : (
              <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                <i className="fas fa-image text-muted-foreground text-2xl"></i>
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{part.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{part.carModel}</p>
              
              <div className="flex items-center justify-between mb-2">
                <Badge variant={part.condition === 'new' ? 'default' : 'secondary'}>
                  {part.condition === 'new' ? 'New' : 'Used'}
                </Badge>
                {part.price && (
                  <span className="font-bold text-primary text-lg">
                    GHS {part.price}
                  </span>
                )}
              </div>
              
              {showSellerInfo && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    <i className={`fas ${part.seller.sellerType === 'business' ? 'fa-store' : 'fa-user'} mr-1`}></i>
                    {part.seller.sellerType === 'business' ? 'Business' : 'Private'}
                    {part.seller.isVerified && (
                      <i className="fas fa-check-circle text-success ml-1" title="Verified"></i>
                    )}
                  </span>
                  {part.seller.location && (
                    <span>
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {part.seller.location}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
      data-testid={`part-card-${part.id}`}
    >
      <div className="relative">
        {part.images && part.images[0] ? (
          <img 
            src={part.images[0]} 
            alt={part.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <i className="fas fa-image text-muted-foreground text-4xl"></i>
          </div>
        )}
        
        {part.images && part.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <i className="fas fa-images mr-1"></i>
            {part.images.length} photos
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{part.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{part.carModel}</p>
        
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant={part.condition === 'new' ? 'default' : 'secondary'}
            className={part.condition === 'new' ? 'bg-success/10 text-success' : 'bg-yellow-100 text-yellow-800'}
          >
            {part.condition === 'new' ? 'New' : 'Used'}
          </Badge>
          {part.price && (
            <span className="font-bold text-primary">
              GHS {part.price}
            </span>
          )}
        </div>
        
        {showSellerInfo && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              <i className={`fas ${part.seller.sellerType === 'business' ? 'fa-store' : 'fa-user'} mr-1`}></i>
              {part.seller.sellerType === 'business' ? 'Business' : 'Private'}
              {part.seller.isVerified && (
                <i className="fas fa-check-circle text-success ml-1" title="Verified"></i>
              )}
            </span>
            {part.seller.location && (
              <span>
                <i className="fas fa-map-marker-alt mr-1"></i>
                {part.seller.location.split(',')[0]}
              </span>
            )}
          </div>
        )}
        
        {part.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {part.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
