import React, { useState, useEffect } from "react";
import { FeeSection } from "../../lib/db";
import { IndianRupee, Save, Plus, CheckCircle2, Edit3, Trash2, X } from "lucide-react";

interface FeeStructureModuleProps {
  feeStructure: FeeSection[];
  onSaveFeeStructure: (sections: FeeSection[]) => Promise<void>;
}

const DEFAULT_FEE_SECTIONS: FeeSection[] = [
  {
    id: "fee-1",
    title: "Pre-Primary (Class PG to UKG)",
    total: "₹24,000",
    admissionPay: "₹5,000",
    data: [
      { label: "Quarter 1 (Apr - Jun)", amount: "₹6,000" },
      { label: "Quarter 2 (Jul - Sep)", amount: "₹6,000" },
      { label: "Quarter 3 (Oct - Dec)", amount: "₹6,000" },
      { label: "Quarter 4 (Jan - Mar)", amount: "₹6,000" },
      { label: "One-Time Admission Fee", amount: "₹5,000" }
    ]
  },
  {
    id: "fee-2",
    title: "Primary (Class I to Class V)",
    total: "₹32,000",
    admissionPay: "₹6,000",
    data: [
      { label: "Quarter 1 (Apr - Jun)", amount: "₹8,000" },
      { label: "Quarter 2 (Jul - Sep)", amount: "₹8,000" },
      { label: "Quarter 3 (Oct - Dec)", amount: "₹8,000" },
      { label: "Quarter 4 (Jan - Mar)", amount: "₹8,000" },
      { label: "One-Time Admission Fee", amount: "₹6,000" }
    ]
  },
  {
    id: "fee-3",
    title: "Middle & High School (Class VI to Class X)",
    total: "₹38,000",
    admissionPay: "₹7,000",
    data: [
      { label: "Quarter 1 (Apr - Jun)", amount: "₹9,500" },
      { label: "Quarter 2 (Jul - Sep)", amount: "₹9,500" },
      { label: "Quarter 3 (Oct - Dec)", amount: "₹9,500" },
      { label: "Quarter 4 (Jan - Mar)", amount: "₹9,500" },
      { label: "One-Time Admission Fee", amount: "₹7,000" }
    ]
  },
  {
    id: "fee-4",
    title: "Senior Secondary (Class XI & XII Science)",
    total: "₹58,000",
    admissionPay: "₹10,000",
    data: [
      { label: "Quarter 1 (Apr - Jun)", amount: "₹14,500" },
      { label: "Quarter 2 (Jul - Sep)", amount: "₹14,500" },
      { label: "Quarter 3 (Oct - Dec)", amount: "₹14,500" },
      { label: "Quarter 4 (Jan - Mar)", amount: "₹14,500" },
      { label: "One-Time Admission Fee", amount: "₹10,000" }
    ]
  },
  {
    id: "fee-5",
    title: "Senior Secondary (Class XI & XII Commerce/Arts)",
    total: "₹52,000",
    admissionPay: "₹10,000",
    data: [
      { label: "Quarter 1 (Apr - Jun)", amount: "₹13,000" },
      { label: "Quarter 2 (Jul - Sep)", amount: "₹13,000" },
      { label: "Quarter 3 (Oct - Dec)", amount: "₹13,000" },
      { label: "Quarter 4 (Jan - Mar)", amount: "₹13,000" },
      { label: "One-Time Admission Fee", amount: "₹10,000" }
    ]
  }
];

export const FeeStructureModule: React.FC<FeeStructureModuleProps> = ({
  feeStructure,
  onSaveFeeStructure
}) => {
  const [sections, setSections] = useState<FeeSection[]>(
    feeStructure && feeStructure.length > 0 ? feeStructure : DEFAULT_FEE_SECTIONS
  );

  useEffect(() => {
    if (feeStructure && feeStructure.length > 0) {
      setSections(feeStructure);
    }
  }, [feeStructure]);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit Modal Form State
  const [modalForm, setModalForm] = useState<FeeSection>({
    id: "",
    title: "",
    total: "",
    admissionPay: "",
    data: []
  });

  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setModalForm({
      id: `fee_${Date.now()}`,
      title: "",
      total: "₹0",
      admissionPay: "₹0",
      data: [
        { label: "One-Time Admission Fee", amount: "₹0" },
        { label: "Quarter 1 (Apr - Jun)", amount: "₹0" },
        { label: "Quarter 2 (Jul - Sep)", amount: "₹0" },
        { label: "Quarter 3 (Oct - Dec)", amount: "₹0" },
        { label: "Quarter 4 (Jan - Mar)", amount: "₹0" }
      ]
    });
    setEditModalOpen(true);
  };

  const handleOpenEditModal = (idx: number) => {
    setEditingIndex(idx);
    setModalForm(JSON.parse(JSON.stringify(sections[idx])));
    setEditModalOpen(true);
  };

  const handleModalSave = () => {
    if (!modalForm.title.trim()) return;
    const next = [...sections];
    if (editingIndex !== null) {
      next[editingIndex] = modalForm;
    } else {
      next.push(modalForm);
    }
    setSections(next);
    setEditModalOpen(false);
  };

  const handleDeleteSection = (idx: number) => {
    if (confirm(`Delete fee structure section "${sections[idx].title}"?`)) {
      const next = sections.filter((_, i) => i !== idx);
      setSections(next);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSaveFeeStructure(sections);
      setSuccessMsg("✅ Fee structure configuration successfully saved!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Save fee structure error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItemToModal = () => {
    setModalForm({
      ...modalForm,
      data: [...modalForm.data, { label: "New Fee Item", amount: "₹0" }]
    });
  };

  const handleRemoveItemFromModal = (itemIdx: number) => {
    setModalForm({
      ...modalForm,
      data: modalForm.data.filter((_, i) => i !== itemIdx)
    });
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Add Fee Structure Group</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save All Configurations"}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Fee Breakdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((item, idx) => (
          <div key={item.id || idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-base">{item.title}</h3>
                <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  {item.total}/yr
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60 font-bold">
                  <span className="text-slate-400">One-Time Admission Fee:</span>
                  <span className="font-mono text-emerald-400">{item.admissionPay}</span>
                </div>
                {item.data.map((sub, sIdx) => (
                  <div key={sIdx} className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">{sub.label}:</span>
                    <span className="font-mono text-white font-bold">{sub.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(idx)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Fee Group
              </button>
              <button
                onClick={() => handleDeleteSection(idx)}
                className="p-1.5 bg-slate-950 border border-slate-800 hover:border-red-500/40 text-red-400 rounded-xl text-xs font-bold transition-all"
                title="Delete Fee Group"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE FEE STRUCTURE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-400" />
                {editingIndex !== null ? "Edit Fee Breakdown" : "Add Fee Breakdown Group"}
              </h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Class / Category Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Primary (Class I to Class V)"
                  value={modalForm.title}
                  onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Annual Total Fee *</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹32,000"
                    value={modalForm.total}
                    onChange={(e) => setModalForm({ ...modalForm, total: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Admission Fee *</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹6,000"
                    value={modalForm.admissionPay}
                    onChange={(e) => setModalForm({ ...modalForm, admissionPay: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold">Quarterly & Fee Items Breakdown:</label>
                  <button
                    type="button"
                    onClick={handleAddItemToModal}
                    className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Fee Head
                  </button>
                </div>

                {modalForm.data.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Label e.g. Quarter 1"
                      value={item.label}
                      onChange={(e) => {
                        const nextData = [...modalForm.data];
                        nextData[itemIdx].label = e.target.value;
                        setModalForm({ ...modalForm, data: nextData });
                      }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Amount e.g. ₹8,000"
                      value={item.amount}
                      onChange={(e) => {
                        const nextData = [...modalForm.data];
                        nextData[itemIdx].amount = e.target.value;
                        setModalForm({ ...modalForm, data: nextData });
                      }}
                      className="w-28 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-mono font-bold text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItemFromModal(itemIdx)}
                      className="p-2 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSave}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg"
              >
                Save Fee Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
