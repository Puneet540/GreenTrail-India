import { Link } from "wouter";
import { Instagram, Twitter, Youtube, Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-5">
          <Link href="/" className="italic font-serif text-3xl inline-block font-medium" data-testid="footer-logo">
            GreenTrail India
          </Link>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Crafted for the Modern Naturalist. Connecting conscious travelers with India's untamed spirit since 2021.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-white transition-colors" data-testid="footer-social-instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-white transition-colors" data-testid="footer-social-twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-white transition-colors" data-testid="footer-social-youtube">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-5 text-white">Explore</h4>
          <ul className="space-y-3">
            {[
              { label: "Destinations", href: "/destinations" },
              { label: "Eco Retreats", href: "/stays" },
              { label: "Hidden Gems", href: "/hidden-gems" },
              { label: "Stays Map", href: "/stays/map" },
              { label: "Train Search", href: "/travel/trains" },
              { label: "Travel Routes", href: "/travel" },
              { label: "AI Planner", href: "/ai-planner" },
              { label: "Seasonal Guide", href: "/seasonal" },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary-foreground/70 hover:text-white transition-colors text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-5 text-white">Community</h4>
          <ul className="space-y-3">
            {[
              { label: "Trail Journal", href: "/stories" },
              { label: "Our Manifesto", href: "/about" },
              { label: "Community Stories", href: "/community" },
              { label: "My Journeys", href: "/my-journeys" },
              { label: "Common Trails (FAQ)", href: "/faq" },
              { label: "Contact Us", href: "/contact" },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary-foreground/70 hover:text-white transition-colors text-sm" data-testid={`footer-link-${link.href.replace("/","")}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-5 text-white">Popular Destinations</h4>
          <ul className="space-y-3">
            {["Spiti Valley", "Ladakh", "Jibhi", "Rishikesh", "Kerala", "Wayanad"].map(dest => (
              <li key={dest}>
                <Link href={`/destinations?q=${dest.toLowerCase()}`} className="text-primary-foreground/70 hover:text-white transition-colors text-sm" data-testid={`footer-dest-${dest.toLowerCase().replace(/\s+/g, '-')}`}>
                  {dest}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
        <p className="flex items-center gap-1.5">
          <Leaf className="w-4 h-4" /> © 2026 GreenTrail India. Crafted with love for the wild.
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary-foreground/80 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-foreground/80 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary-foreground/80 transition-colors">Eco Commitment</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
