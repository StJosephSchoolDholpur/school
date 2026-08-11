import React from "react";
import { Student, Teacher, TCRecordData, TransportRoute } from "../../lib/db";
import { Users, GraduationCap, FileCheck2, Bus, TrendingUp, Calendar, ShieldCheck, UserCheck } from "lucide-react";

interface OverviewModuleProps {
  students: Student[];
  teachers: Teacher[];
  tcs: TCRecordData[];
  routes: TransportRoute[];
  onNavigateTab: (tab: any) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  students,
  teachers,
  tcs,
  routes,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome ERP Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              St. Joseph ERP
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
            Welcome to School Management Portal
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Real-time management for admissions, class-wise student directory, faculty records, daily attendance, CBSE report cards, and fee receipts.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onNavigateTab("students")}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Class-Wise ➔
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{students.length}</span>
            <h3 className="text-xs font-bold text-slate-400 mt-1">Total Enrolled Students</h3>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("teachers")}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
              Faculty ➔
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{teachers.length}</span>
            <h3 className="text-xs font-bold text-slate-400 mt-1">Active Faculty Members</h3>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("tc")}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Verified ➔
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{tcs.length}</span>
            <h3 className="text-xs font-bold text-slate-400 mt-1">Transfer Certificates Issued</h3>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("transport")}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Bus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
              Routes ➔
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{routes.length}</span>
            <h3 className="text-xs font-bold text-slate-400 mt-1">Active Bus Routes</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
