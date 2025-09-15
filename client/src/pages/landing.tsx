import { useLocation } from "wouter";
import Navbar from "@/components/navbar";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/parts");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Auto Parts Fast</h1>
            <p className="text-xl opacity-90">Ghana's largest marketplace for car parts</p>
          </div>
          
          {/* Search Section */}
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Part Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Brake Pads" 
                    className="w-full px-4 py-3 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                    data-testid="input-part-name"
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

      {/* Popular Categories */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setLocation('/parts')} data-testid="category-engine">
            <i className="fas fa-car text-3xl text-primary mb-3"></i>
            <h3 className="font-semibold">Engine Parts</h3>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setLocation('/parts')} data-testid="category-brake">
            <i className="fas fa-tools text-3xl text-primary mb-3"></i>
            <h3 className="font-semibold">Brake System</h3>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setLocation('/parts')} data-testid="category-electrical">
            <i className="fas fa-battery-full text-3xl text-primary mb-3"></i>
            <h3 className="font-semibold">Electrical</h3>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setLocation('/parts')} data-testid="category-transmission">
            <i className="fas fa-cogs text-3xl text-primary mb-3"></i>
            <h3 className="font-semibold">Transmission</h3>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Search</h3>
              <p className="text-muted-foreground">Enter your car model and the part you need</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Browse</h3>
              <p className="text-muted-foreground">View listings from verified sellers near you</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-muted-foreground">Call, WhatsApp, or chat with the seller</p>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6">Join thousands of buyers and sellers on QuickParts</p>
        <button 
          onClick={() => window.location.href = '/api/login'} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-md transition-colors"
          data-testid="button-login"
        >
          Sign In to Continue
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <i className="fas fa-cog text-primary text-xl"></i>
                <span className="font-bold text-primary">QuickParts</span>
              </div>
              <p className="text-muted-foreground text-sm">Ghana's largest marketplace for auto parts. Find quality parts for your vehicle quickly and easily.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Browse Parts</a></li>
                <li><a href="#" className="hover:text-foreground">Search by Model</a></li>
                <li><a href="#" className="hover:text-foreground">Buyer Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Start Selling</a></li>
                <li><a href="#" className="hover:text-foreground">Seller Guide</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Safety Tips</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-4 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 QuickParts. All rights reserved. Made with ❤️ for Ghana's automotive community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
