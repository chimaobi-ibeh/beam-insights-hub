import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, PenSquare } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import beamxLogo from "@/assets/beamx-logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isEditor } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="BeamX Blog" className="flex items-center gap-2">
          <img src={beamxLogo} alt="BeamX Solutions" className="h-8 w-auto" />
          <span className="sr-only">BeamX Blog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-accent font-semibold' : 'text-foreground/80 hover:text-foreground'}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-accent font-semibold' : 'text-foreground/80 hover:text-foreground'}`}
          >
            About
          </Link>
          <Link 
            to="/categories" 
            className={`text-sm font-medium transition-colors ${isActive('/categories') ? 'text-accent font-semibold' : 'text-foreground/80 hover:text-foreground'}`}
          >
            Categories
          </Link>
          <a 
            href="https://beamxsolutions.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Main Site
          </a>
          {user && (
            <Link 
              to="/editor" 
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/editor') ? 'text-accent font-semibold' : 'text-accent hover:text-accent/80'}`}
            >
              <PenSquare className="h-4 w-4" />
              {isEditor ? "Editor" : "Dashboard"}
            </Link>
          )}
          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <a href="https://calendly.com/beamxsolutions" target="_blank" rel="noopener noreferrer">
              Contact Us
            </a>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container py-4 flex flex-col gap-3">
            <Link 
              to="/" 
              className={`text-sm font-medium py-2 ${isActive('/') ? 'text-accent font-semibold' : 'text-foreground/80 hover:text-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium py-2 ${isActive('/about') ? 'text-accent font-semibold' : 'text-foreground/80 hover:text-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/categories" 
              className={`text-sm font-medium py-2 ${isActive('/categories') ? 'text-accent font-semibold' : 'text-foreground/80 hover:text-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <a 
              href="https://beamxsolutions.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground/80 hover:text-foreground py-2"
            >
              Main Site
            </a>
            {user && (
              <Link 
                to="/editor" 
                className={`text-sm font-medium py-2 flex items-center gap-1 ${isActive('/editor') ? 'text-accent font-semibold' : 'text-accent hover:text-accent/80'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PenSquare className="h-4 w-4" />
                {isEditor ? "Editor" : "Dashboard"}
              </Link>
            )}
            <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground w-fit">
              <a href="https://calendly.com/beamxsolutions" target="_blank" rel="noopener noreferrer">
                Contact Us
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
