import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkIcon, UserCircle, Menu, X, Leaf, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { label: "Destinations", href: "/destinations" },
    { label: "Retreats", href: "/stays" },
    { label: "Travel", href: "/travel" },
    { label: "Journal", href: "/stories" },
    { label: "AI Planner", href: "/ai-planner", highlight: true },
  ];

  const moreLinks = [
    { label: "Hidden Gems", href: "/hidden-gems" },
    { label: "Seasonal Guide", href: "/seasonal" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed z-50 transition-all duration-300
        top-0 left-0 w-full rounded-none px-5 py-4
        md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-[95%] md:max-w-7xl md:rounded-full md:px-6 md:py-3
        flex items-center justify-between
        ${scrolled ? "md:shadow-lg md:shadow-primary/10 shadow-sm" : ""}
        glass border-b border-white/20 md:border md:border-white/30`}
      >
        <Link href="/" data-testid="nav-link-logo" className="italic font-serif text-primary text-xl font-medium">
          GreenTrail India
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`text-sm font-semibold transition-colors hover:text-primary flex items-center gap-1 ${
                location.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
              } ${link.highlight ? "text-secondary" : ""}`}
            >
              {link.highlight && <Sparkles className="w-3.5 h-3.5" />}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/my-journeys">
            <Button variant="ghost" size="icon" className="rounded-full hidden md:flex text-primary hover:text-secondary hover:bg-primary/5" data-testid="nav-btn-bookmarks">
              <BookmarkIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full hidden md:flex text-primary hover:text-secondary hover:bg-primary/5" data-testid="nav-btn-profile">
              <UserCircle className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden text-primary hover:bg-primary/5"
            data-testid="nav-btn-menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-background/95 backdrop-blur-xl z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                <span className="font-serif italic text-primary text-lg">GreenTrail India</span>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" onClick={() => setMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {[...links, ...moreLinks].map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors cursor-pointer ${location.startsWith(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
                      <span className="font-medium text-sm">{link.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="px-4 py-6 border-t border-border space-y-2">
                <Link href="/profile">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted transition-colors cursor-pointer">
                    <UserCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">My Profile</span>
                  </div>
                </Link>
                <Link href="/my-journeys">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted transition-colors cursor-pointer">
                    <BookmarkIcon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">My Journeys</span>
                  </div>
                </Link>
                <Link href="/login">
                  <div className="mt-4 btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-2xl text-sm font-medium cursor-pointer">
                    <Leaf className="w-4 h-4" />
                    Sign In
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
