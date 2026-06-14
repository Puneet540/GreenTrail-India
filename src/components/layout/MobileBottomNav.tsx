import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { label: "Destinations", href: "/destinations", icon: "landscape" },
  { label: "Retreats",     href: "/stays",        icon: "spa" },
  { label: "AI Trail",    href: "/ai-planner",   icon: "auto_awesome" },
  { label: "Journal",     href: "/stories",      icon: "menu_book" },
  { label: "Profile",     href: "/profile",      icon: "account_circle" },
];

export function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pt-2"
      style={{
        background: "rgba(237,239,231,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(194,201,187,0.4)",
        boxShadow: "0 -8px 32px rgba(45,90,39,0.06)",
        paddingBottom: "max(env(safe-area-inset-bottom, 8px), 8px)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href}>
            <button className="flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[56px]">
              {active ? (
                <div className="bg-[#b6eeab] px-4 py-1 rounded-full mb-0.5">
                  <span
                    className="material-symbols-outlined text-[#154212]"
                    style={{ fontVariationSettings: "'FILL' 1", fontSize: "22px" }}
                  >
                    {item.icon}
                  </span>
                </div>
              ) : (
                <span
                  className="material-symbols-outlined text-[#42493e] mb-0.5"
                  style={{ fontVariationSettings: "'FILL' 0", fontSize: "22px" }}
                >
                  {item.icon}
                </span>
              )}
              <span
                className="text-[11px] font-semibold leading-tight"
                style={{
                  color: active ? "#154212" : "#42493e",
                  fontFamily: "Hanken Grotesk, sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </span>
            </button>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
