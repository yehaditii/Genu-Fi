import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import WalletConnector from "@/components/WalletConnector";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/student", label: "Student" },
  { to: "/institution", label: "Institution" },
  { to: "/recruiter", label: "Recruiter" },
  { to: "/activity", label: "Activity" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-aqua-neon/20 bg-deep-navy/90 backdrop-blur">
      <nav className="container mx-auto flex min-h-[76px] items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-2xl font-bold text-neon">
          GenuFi
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-aqua-neon" : "text-soft-neon hover:text-aqua-neon"
              }
            >
              {item.label}
            </NavLink>
          ))}
          <WalletConnector />
        </div>

        <button
          className="rounded-lg p-2 text-aqua-neon lg:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-aqua-neon/20 bg-deep-navy px-4 py-4 sm:px-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "rounded-lg bg-aqua-neon/10 px-3 py-2 text-aqua-neon" : "rounded-lg px-3 py-2 text-soft-neon hover:text-aqua-neon"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <WalletConnector />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
