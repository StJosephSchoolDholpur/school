import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from "lucide-react";

import logo from "@/assets/logo.png";
import specil_edu from "/public/PDFs/Special-Educator-AGREEMENT-LETTER.pdf";
import Affiliation from "/public/PDFs/Affiliation.pdf";
import Buliding_Safety from "@/assets/Building_Safety.png";
import society from "@/assets/Society.png";
import noc from "/public/PDFs/Noc .pdf";

interface NavChild {
  label: string;
  path: string;
  external?: boolean;
}

interface NavItem {
  label: string;
  path?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  {
    label: "About",
    children: [
      { label: "About Us", path: "/about" },
      { label: "Director's Message", path: "/director-message" },
      { label: "Principal's Message", path: "/principal-message" },
      { label: "Vision & Mission", path: "/vision-mission" },
      { label: "Faculty", path: "/faculty" },
    ],
  },
  {
    label: "Academics",
    children: [
      { label: "Academics", path: "/academics" },
      { label: "Curriculum", path: "/curriculum" },
      { label: "Books Sets", path: "/books" },
      { label: "Achievements", path: "/achievements" },
      { label: "TC Portal", path: "/tc" },
    ],
  },
  {
    label: "Campus Life",
    children: [
      { label: "Student Life", path: "/student-life" },
      { label: "Sports", path: "/sports" },
      { label: "Co-Curricular", path: "/co-curricular" },
      { label: "Infrastructure", path: "/infrastructure" },
    ],
  },
  { label: "Admissions", path: "/admissions" },
  { label: "Gallery", path: "/gallery" },
  {
    label: "Resources",
    children: [
      { label: "Mandatory Public Disclosure", path: "/mandatory-public-disclosure" },
      { label: "Fee Structure", path: "/fee-structure" },
      { label: "Events", path: "/events" },
      { label: "News", path: "/news" },
      { label: "Calendar", path: "/calendar" },
      { label: "Transportation", path: "/transportation" },
    ],
  },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const scrolledRef = useRef(false);
  const tickingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;

    requestAnimationFrame(() => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navBarClass = useMemo(
    () =>
      `fixed top-100 left-0 right-0 z-50 ${scrolled
        ? "bg-primary/95 backdrop-blur-xl shadow-lg top-0"
        : "bg-primary shadow-md"
      }`,
    [scrolled]
  );

  const navInnerClass = useMemo(
    () =>
      `container mx-auto flex items-center justify-between px-4 transition-[padding] duration-500 ${scrolled ? "py-2" : "py-2.5"
      }`,
    [scrolled]
  );

  return (
    <header className="w-full">
      {/* Contact strip */}
      <div
        className={`bg-primary/95 text-primary-foreground text-xs py-2 px-4 overflow-hidden will-change-[opacity,transform] transition-[opacity,transform] duration-500 ease-out origin-top ${scrolled
          ? "opacity-0 -translate-y-2 max-h-0 py-0 pointer-events-none"
          : "opacity-100 translate-y-0 max-h-20"
          }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91‑88245-51683
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> stjosephdholpur@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Dholpur, Rajasthan, India
          </div>
        </div>
      </div>

      {/* BRAND BAND — big centered school name */}
      <div
        className={`bg-card border-b border-border/40 overflow-hidden will-change-[opacity,transform] transition-[opacity,transform] duration-500 ease-out origin-top ${scrolled
          ? "opacity-0 -translate-y-2 max-h-0 py-0 pointer-events-none"
          : "opacity-100 translate-y-0 max-h-60 py-5"
          }`}
      >
        <Link
          to="/"
          className="container mx-auto flex items-center justify-center gap-5 md:gap-7 px-4 group"
        >
          <img
            src={logo}
            alt="St. Joseph's International School Logo"
            className="object-contain h-16 md:h-20 w-16 md:w-20 transition-transform duration-500 group-hover:rotate-6"
          />
          <div className="text-center">
            <p className="font-heading font-extrabold text-primary leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight">
              St. Joseph's International School
            </p>
            <p className="text-secondary font-heading italic text-sm md:text-base mt-1">
              A New Era in Versatility
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              CBSE School | Dholpur
            </p>
          </div>
        </Link>
      </div>

      {/* DARK NAV BAR */}
      <nav className={navBarClass}>
        <div className={navInnerClass}>
          {/* Compact logo only when scrolled */}
          <Link
            to="/"
            className={`flex items-center gap-2 overflow-hidden will-change-[opacity,transform] transition-[opacity,transform] duration-500 ${scrolled
              ? "opacity-100 translate-x-0 max-w-[200px]"
              : "opacity-0 -translate-x-2 max-w-[200px] lg:max-w-0 pointer-events-none"
              }`}
          >
            <img src={logo} alt="Logo" className="h-9 w-9 object-contain shrink-0" />
            <span className="font-heading font-bold text-primary-foreground text-sm whitespace-nowrap">
              St. Joseph's
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5 mx-auto ">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="relative flex items-center gap-1 px-4 py-2.5 text-sm font-semibold text-primary-foreground/90 rounded-full hover:bg-secondary/20 hover:text-secondary transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Dropdown Container with zero gap hover bridge */}
                  <div
                    className={`absolute top-full left-0 pt-2 min-w-[220px] z-50 will-change-[opacity,transform] transition-[opacity,transform] duration-300 ${openDropdown === item.label
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2 pointer-events-none"
                      }`}
                  >
                    {/* Inner Dropdown Card */}
                    <div className="bg-white backdrop-blur-xl shadow-2xl rounded-2xl py-2 border border-border/60 relative">
                      <div className="absolute -top-1 left-6 w-2 h-2 bg-white border-l border-t border-border/60 rotate-45" />

                      {item.children.map((child) =>
                        child.external ? (
                          <a
                            key={child.path}
                            href={child.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpenDropdown(null)}
                            className="group/item flex items-center justify-between px-4 py-2.5 mx-1 my-0.5 text-sm rounded-xl hover:bg-primary/8 hover:text-primary hover:translate-x-1 transition-[background-color,color,transform] text-foreground/80"
                          >
                            <span>{child.label}</span>

                            <span className="opacity-0 group-hover/item:opacity-100 transition-opacity text-secondary">
                              ›
                            </span>
                          </a>

                        ) : (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setOpenDropdown(null)}
                            className={`group/item flex items-center justify-between px-4 py-2.5 mx-1 my-0.5 text-sm rounded-xl hover:bg-primary/8 hover:text-primary hover:translate-x-1 transition-[background-color,color,transform] ${location.pathname === child.path
                              ? "text-primary font-semibold bg-primary/10"
                              : "text-foreground/80"
                              }`}
                          >
                            <span>{child.label}</span>
                            <span className="opacity-0 group-hover/item:opacity-100 transition-opacity text-secondary">
                              ›
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path!}
                  className={`relative px-4 py-2.5 text-sm font-semibold rounded-full hover:bg-secondary/20 hover:text-secondary transition-colors ${location.pathname === item.path
                    ? "text-secondary bg-secondary/15"
                    : "text-primary-foreground/90"
                    }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary" />
                  )}
                </Link>
              )
            )}
          </div>

          <Link
            to="/admissions"
            className="hidden lg:inline-flex btn-secondary text-xs px-4 py-2 rounded-full items-center gap-1.5 shadow-md hover:shadow-secondary/40 hover:scale-105 transition-[transform,box-shadow]"
          >
            Apply Now
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-primary-foreground hover:bg-secondary/20 transition-colors ml-auto"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-card border-t animate-fade-in bg-white">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                      className="w-full text-left py-2 px-3 nav-link flex items-center justify-between"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openDropdown === item.label && (
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) =>
                          child.external ? (
                            <a
                              key={child.path}
                              href={child.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMobileOpen(false)}
                              className="block py-1.5 px-3 text-sm text-foreground/70 hover:text-primary"
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1.5 px-3 text-sm text-foreground/70 hover:text-primary"
                            >
                              {child.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path!}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 nav-link"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 