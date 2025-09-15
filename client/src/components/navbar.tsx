import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setLocation('/')}
          >
            <i className="fas fa-cog text-primary text-2xl"></i>
            <span className="text-xl font-bold text-primary">QuickParts</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/')}
                  className={isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                  data-testid="nav-home"
                >
                  <i className="fas fa-home"></i>
                  <span className="hidden sm:inline ml-1">Home</span>
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/parts')}
                  className={isActive('/parts') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                  data-testid="nav-parts"
                >
                  <i className="fas fa-list"></i>
                  <span className="hidden sm:inline ml-1">All Parts</span>
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/sell')}
                  className={isActive('/sell') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                  data-testid="nav-sell"
                >
                  <i className="fas fa-store"></i>
                  <span className="hidden sm:inline ml-1">Sell</span>
                </Button>
                
                {user?.isAdmin && (
                  <Button
                    variant="ghost"
                    onClick={() => setLocation('/admin')}
                    className={isActive('/admin') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                    data-testid="nav-admin"
                  >
                    <i className="fas fa-user-shield"></i>
                    <span className="hidden sm:inline ml-1">Admin</span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="hidden sm:inline ml-1">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login-nav"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span className="hidden sm:inline ml-1">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
