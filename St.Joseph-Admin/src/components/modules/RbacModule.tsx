import React from "react";
import { ShieldCheck, Check } from "lucide-react";

export const RbacModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" /> Roles & Access Security Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure Role-Based Access Control (RBAC) permissions for Principal, Accountants, and Teachers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Super Admin", role: "super_admin", desc: "Unrestricted access to all modules, fees, security & DB operations." },
          { title: "Principal", role: "principal", desc: "Access to student/teacher rosters, exam marks, and TC approvals." },
          { title: "Accountant", role: "accountant", desc: "Access restricted to fee collections, billing receipts & financial reports." },
          { title: "Class Teacher", role: "teacher", desc: "Access restricted to assigned class student attendance & marks entry." }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">{item.title}</h4>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400">{item.desc}</p>
            <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Permission Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
