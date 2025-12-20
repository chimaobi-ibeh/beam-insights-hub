import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, PenSquare } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import beamxLogo from "@/assets/beamx-logo.png";
import { cn } from "@/lib/utils";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isEditor } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navLinkBase =
    "relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100";

  const navLinkClasses = (path: string) =>
    cn(
      navLinkBase,
      isActive(path)
        ? "text-accent font-semibold after:scale-x-100"
        : "text-foreground/80 hover:text-foreground",
    );

  const editorLinkClasses = (path: string) =>
    cn(
      navLinkBase,
      isActive(path)
        ? "text-accent font-semibold after:scale-x-100"
        : "text-accent hover:text-accent/80",
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="BeamX Blog" className="flex items-center gap-2">
          <img
            src={beamxLogo}
            alt="BeamX Solutions"
            className="h-8 w-auto transition-transform duration-200 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
          />
          <span className="sr-only">BeamX Blog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={navLinkClasses("/")}>Home</Link>
          <Link to="/about" className={navLinkClasses("/about")}>About</Link>
          <Link to="/categories" className={navLinkClasses("/categories")}>Categories</Link>
          <a 
            href="https://beamxsolutions.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Main Site
          </a>
          {user && (
            <Link to="/editor" className={cn(editorLinkClasses("/editor"), "flex items-center gap-1")}>
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
          className="md:hidden rounded-md p-2 transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background animate-in fade-in slide-in-from-top-2 duration-200 motion-reduce:animate-none">
          <nav className="container py-4 flex flex-col gap-3">
            <Link to="/" className={cn(navLinkClasses("/"), "py-2")} onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" className={cn(navLinkClasses("/about"), "py-2")} onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/categories" className={cn(navLinkClasses("/categories"), "py-2")} onClick={() => setMobileMenuOpen(false)}>
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
                className={cn(editorLinkClasses("/editor"), "py-2 flex items-center gap-1")}
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
