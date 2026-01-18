import { Link } from "react-router-dom";
import { Shield, Lock, Zap, Mail, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import gxchangeLogo from "@/assets/gxchange-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto py-16">
        {/* Download App CTA */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 md:p-8 mb-12 border border-primary/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/30 flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold">Get the gXchange App</h3>
                <p className="text-background/70 text-sm">
                  Install our app for faster trades on iOS & Android
                </p>
              </div>
            </div>
            <Link to="/install">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-8"
              >
                <Download className="w-5 h-5" />
                Install App
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-background/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Secure</p>
              <p className="text-xs text-background/60">256-bit SSL</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium">Private</p>
              <p className="text-xs text-background/60">Data protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Fast</p>
              <p className="text-xs text-background/60">Quick processing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium">24/7 Support</p>
              <p className="text-xs text-background/60">Always here</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={gxchangeLogo} 
                alt="gXchange" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-lg font-bold">
                g<span className="text-primary">X</span>change
              </span>
            </div>
            <p className="text-sm text-background/60">
              The trusted platform for buying and selling gift cards instantly.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/sell" className="text-sm text-background/60 hover:text-background transition-colors">
                Sell Gift Cards
              </Link>
              <Link to="/buy" className="text-sm text-background/60 hover:text-background transition-colors">
                Buy Gift Cards
              </Link>
              <Link to="/gift-cards" className="text-sm text-background/60 hover:text-background transition-colors">
                All Gift Cards
              </Link>
              <Link to="/blog" className="text-sm text-background/60 hover:text-background transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/help" className="text-sm text-background/60 hover:text-background transition-colors">
                Help Center
              </Link>
              <Link to="/contact" className="text-sm text-background/60 hover:text-background transition-colors">
                Contact Us
              </Link>
              <Link to="/faq" className="text-sm text-background/60 hover:text-background transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-background/60 hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-background/60 hover:text-background transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-background/10 text-center">
          <p className="text-sm text-background/60">
            © {currentYear} gXchange. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
