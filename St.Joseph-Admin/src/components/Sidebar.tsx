import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileCheck2,
  Users,
  GraduationCap,
  IndianRupee,
  Bus,
  ShieldCheck,
  Newspaper,
  BookOpen,
  Trophy,
  Image,
  Calendar as CalendarIcon,
  LogOut,
  LayoutDashboard,
  UserCheck,
  FileSpreadsheet,
  Receipt,
  UserCog,
  Layers
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export type AdminTab =
  | "overview"
  | "classes"
  | "attendance"
  | "examinations"
  | "fee_collections"
  | "tc"
  | "teachers"
  | "students"
  | "fees"
  | "transport"
  | "mandatory"
  | "news"
  | "events"
  | "books"
  | "achievements"
  | "gallery"
  | "calendar"
  | "rbac";

interface MenuItem {
  id: AdminTab;
  path: string;
  label: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { id: "overview", path: "/", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "classes", path: "/classes", label: "Class Master Setup", icon: Layers, badge: "Master" },
    { id: "students", path: "/students", label: "Class-Wise Students", icon: Users },
    { id: "teachers", path: "/teachers", label: "Teachers Directory", icon: GraduationCap },
    { id: "attendance", path: "/attendance", label: "Daily Attendance", icon: UserCheck, badge: "Live" },
    { id: "examinations", path: "/examinations", label: "Exams & Marksheets", icon: FileSpreadsheet, badge: "New" },
    { id: "fee_collections", path: "/fee-collections", label: "Collect Fee & Receipts", icon: Receipt, badge: "Billing" },
    { id: "tc", path: "/tc", label: "TC Portal Manager", icon: FileCheck2 },
    { id: "fees", path: "/fee-structure", label: "Fee Structure", icon: IndianRupee },
    { id: "transport", path: "/transport", label: "Transportation Routes", icon: Bus },
    { id: "mandatory", path: "/mandatory", label: "Mandatory Disclosure", icon: ShieldCheck },
    { id: "news", path: "/news", label: "News & Announcements", icon: Newspaper },
    { id: "events", path: "/events", label: "School Events", icon: CalendarIcon },
    { id: "books", path: "/books", label: "Book List", icon: BookOpen },
    { id: "achievements", path: "/achievements", label: "Achievements", icon: Trophy },
    { id: "gallery", path: "/gallery", label: "Gallery Photos", icon: Image },
    { id: "calendar", path: "/calendar", label: "School Calendar", icon: CalendarIcon },
    { id: "rbac", path: "/rbac", label: "Roles & Security", icon: UserCog }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="p-5 space-y-6 overflow-y-auto">
        {/* Brand header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg shadow-amber-500/20">
              SJ
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-sm text-white leading-tight">
                St. Joseph's
              </h2>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path ||
              (item.path === "/" && (location.pathname === "/" || location.pathname === "/dashboard"));

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase ${
                      active ? "bg-slate-950/20 text-slate-950" : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-amber-400">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name || "Administrator"}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
