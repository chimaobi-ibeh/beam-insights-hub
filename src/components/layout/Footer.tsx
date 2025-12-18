import { Link } from "react-router-dom";
import beamxLogo from "@/assets/beamx-logo-white.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={beamxLogo} alt="BeamX Solutions" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-md">
              Insights on business intelligence, AI, and data analytics from the experts at BeamX Solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://beamxsolutions.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Main Website
                </a>
              </li>
              <li>
                <a 
                  href="https://beamxsolutions.com/services" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="https://calendly.com/beamxsolutions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/10">
          <p className="text-sm text-primary-foreground/50 text-center">
            © {new Date().getFullYear()} BeamX Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
