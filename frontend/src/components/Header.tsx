import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import FeedbackModal from "@/components/FeedbackModal";
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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const location = useLocation();

  const getFeatureContext = () => {
    if (location.pathname.startsWith("/student")) return "student_dashboard";
    if (location.pathname.startsWith("/institution")) return "institution_dashboard";
    if (location.pathname.startsWith("/recruiter")) return "recruiter_dashboard";
    if (location.pathname.startsWith("/activity")) return "activity_feed";
    return "general";
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-aqua-neon/20 bg-deep-navy/95 backdrop-blur">
        <nav className="container mx-auto flex min-h-[72px] items-center justify-between px-3 py-3 sm:min-h-[76px] sm:px-6 sm:py-4">
          <Link to="/" className="text-xl font-bold text-neon sm:text-2xl">
            GenuFi
          </Link>

          <div className="hidden items-center gap-4 xl:gap-6 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "text-aqua-neon font-medium" : "text-soft-neon hover:text-aqua-neon text-sm"
                }
              >
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-aqua-neon/30 bg-aqua-neon/10 px-3 py-1.5 text-xs font-semibold text-aqua-neon transition hover:bg-aqua-neon/20 hover:text-[#7adbd5]"
              title="Share feedback on GenuFi"
            >
              <MessageSquare size={14} />
              <span>Feedback</span>
            </button>

            <WalletConnector />
          </div>

          <button
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-aqua-neon hover:bg-aqua-neon/10 lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-aqua-neon/20 bg-deep-navy/98 px-4 py-5 shadow-2xl sm:px-6 lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-lg bg-aqua-neon/10 px-3 py-2.5 text-aqua-neon font-medium"
                      : "rounded-lg px-3 py-2.5 text-soft-neon hover:bg-aqua-neon/5 hover:text-aqua-neon"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsFeedbackOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-aqua-neon/30 bg-aqua-neon/10 px-3 py-2.5 text-sm font-semibold text-aqua-neon hover:bg-aqua-neon/20"
              >
                <MessageSquare size={16} />
                <span>Give Feedback</span>
              </button>

              <div className="pt-2">
                <WalletConnector />
              </div>
            </div>
          </div>
        )}
      </header>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        featureContext={getFeatureContext()}
      />
    </>
  );
};

export default Header;
