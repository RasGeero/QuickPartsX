import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { useState } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchForm, setSearchForm] = useState({ carModel: '', partName: '' });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.carModel.trim()) {
      params.append('search', `${searchForm.carModel.trim()} ${searchForm.partName.trim()}`.trim());
    } else if (searchForm.partName.trim()) {
      params.append('search', searchForm.partName.trim());
    }
    setLocation(`/parts${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back, {user?.firstName || user?.businessName || 'User'}!
            </h1>
            <p className="text-lg opacity-90">Find the auto parts you need</p>
          </div>
          
          {/* Quick Search */}
          <div className="bg-card rounded-lg p-6 shadow-xl max-w-2xl mx-auto">
            <form className="space-y-4" onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Car Model</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Toyota Corolla" 
                    className="w-full px-4 py-3 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                    data-testid="input-car-model"
                    value={searchForm.carModel}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, carModel: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Part Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Brake Pads" 
                    className="w-full px-4 py-3 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                    data-testid="input-part-name"
                    value={searchForm.partName}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, partName: e.target.value }))}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-6 rounded-md transition-colors"
                data-testid="button-search"
              >
                <i className="fas fa-search mr-2"></i>
                Search Parts
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setLocation('/parts')}
            data-testid="action-browse-parts"
          >
            <i className="fas fa-search text-3xl text-primary mb-4"></i>
            <h3 className="font-semibold mb-2">Browse All Parts</h3>
            <p className="text-muted-foreground text-sm">Explore our complete catalog of auto parts</p>
          </div>
          
          <div 
            className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setLocation('/sell')}
            data-testid="action-sell-parts"
          >
            <i className="fas fa-plus text-3xl text-secondary mb-4"></i>
            <h3 className="font-semibold mb-2">List a Part</h3>
            <p className="text-muted-foreground text-sm">Sell your auto parts to thousands of buyers</p>
          </div>
          
          <div 
            className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setLocation('/sell')}
            data-testid="action-manage-listings"
          >
            <i className="fas fa-cog text-3xl text-primary mb-4"></i>
            <h3 className="font-semibold mb-2">Manage Listings</h3>
            <p className="text-muted-foreground text-sm">View and edit your current listings</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-muted py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Popular This Week</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <i className="fas fa-car text-2xl text-primary mb-2"></i>
              <h4 className="font-semibold text-sm">Engine Parts</h4>
              <p className="text-xs text-muted-foreground">124 new listings</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <i className="fas fa-tools text-2xl text-primary mb-2"></i>
              <h4 className="font-semibold text-sm">Brake Systems</h4>
              <p className="text-xs text-muted-foreground">89 new listings</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <i className="fas fa-battery-full text-2xl text-primary mb-2"></i>
              <h4 className="font-semibold text-sm">Electrical</h4>
              <p className="text-xs text-muted-foreground">67 new listings</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <i className="fas fa-tire text-2xl text-primary mb-2"></i>
              <h4 className="font-semibold text-sm">Tires</h4>
              <p className="text-xs text-muted-foreground">45 new listings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
