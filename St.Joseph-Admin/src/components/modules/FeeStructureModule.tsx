import React, { useState } from "react";
import { FeeSection } from "../../lib/db";
import { IndianRupee, Save, Plus, CheckCircle2 } from "lucide-react";

interface FeeStructureModuleProps {
  feeStructure: FeeSection[];
  onSaveFeeStructure: (sections: FeeSection[]) => Promise<void>;
}

export const FeeStructureModule: React.FC<FeeStructureModuleProps> = ({
  feeStructure,
  onSaveFeeStructure
}) => {
  const [sections, setSections] = useState<FeeSection[]>(feeStructure);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveFeeStructure(sections);
      setSuccessMsg("✅ Fee structure successfully saved & updated!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Save fee structure error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <IndianRupee className="w-6 h-6 text-amber-400" /> Class-Wise Fee Structure Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure annual tuition fees, admission fees, and quarterly breakdown per class.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Fee Structure"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Fee Breakdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Nursery - UKG", annual: "₹24,000", admission: "₹5,000", q1: "₹6,000", q2: "₹6,000", q3: "₹6,000", q4: "₹6,000" },
          { title: "Class I - Class V", annual: "₹32,000", admission: "₹6,000", q1: "₹8,000", q2: "₹8,000", q3: "₹8,000", q4: "₹8,000" },
          { title: "Class VI - Class VIII", annual: "₹38,000", admission: "₹7,000", q1: "₹9,500", q2: "₹9,500", q3: "₹9,500", q4: "₹9,500" },
          { title: "Class IX - Class X", annual: "₹45,000", admission: "₹8,000", q1: "₹11,250", q2: "₹11,250", q3: "₹11,250", q4: "₹11,250" },
          { title: "Class XI - Class XII (Science)", annual: "₹58,000", admission: "₹10,000", q1: "₹14,500", q2: "₹14,500", q3: "₹14,500", q4: "₹14,500" },
          { title: "Class XI - Class XII (Comm/Arts)", annual: "₹52,000", admission: "₹10,000", q1: "₹13,000", q2: "₹13,000", q3: "₹13,000", q4: "₹13,000" }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">{item.title}</h3>
              <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                {item.annual}/yr
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">One-Time Admission Fee:</span>
                <span className="font-mono font-bold text-emerald-400">{item.admission}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Quarter 1 (Apr - Jun):</span>
                <span className="font-mono">{item.q1}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Quarter 2 (Jul - Sep):</span>
                <span className="font-mono">{item.q2}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Quarter 3 (Oct - Dec):</span>
                <span className="font-mono">{item.q3}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Quarter 4 (Jan - Mar):</span>
                <span className="font-mono">{item.q4}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
