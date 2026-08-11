import React, { useState } from "react";
import { ClassEntity, Student, BookItem } from "../../lib/db";
import { Layers, Plus, Trash2, Edit3, ShieldCheck, CheckCircle2, ArrowUpDown } from "lucide-react";

interface ClassManagementModuleProps {
  classList: ClassEntity[];
  students: Student[];
  books: BookItem[];
  onSaveClass: (c: Omit<ClassEntity, "id"> & { id?: string }) => Promise<void>;
  onDeleteClass: (id: string) => Promise<void>;
}

export const ClassManagementModule: React.FC<ClassManagementModuleProps> = ({
  classList,
  students,
  books,
  onSaveClass,
  onDeleteClass
}) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    stream: "General",
    display_order: classList.length + 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveClass({
        id: editingId || undefined,
        name: form.name.trim(),
        code: form.code.trim() || form.name.replace(/class/i, "").trim(),
        stream: form.stream,
        display_order: Number(form.display_order) || classList.length + 1,
        is_active: true
      });
      setForm({ name: "", code: "", stream: "General", display_order: classList.length + 1 });
      setEditingId(null);
    } catch (err) {
      console.error("Save class error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (c: ClassEntity) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      code: c.code || "",
      stream: c.stream || "General",
      display_order: c.display_order || 1
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" /> Class Master Database Setup
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, and manage school classes dynamically. AllERP modules fetch classes directly from this database.
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs">
          Active Classes: {classList.length} Configured
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Add/Edit Class */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              {editingId ? "Edit Class Master" : "Add New Class"}
            </span>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", code: "", stream: "General", display_order: classList.length + 1 });
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Class Title *</label>
              <input
                type="text"
                placeholder="e.g. Class Nursery or Class 11 Vocational *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Class Code</label>
                <input
                  type="text"
                  placeholder="e.g. 10"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Display Order</label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Stream / Category</label>
              <select
                value={form.stream}
                onChange={(e) => setForm({ ...form, stream: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-amber-400 focus:outline-none font-bold"
              >
                <option value="General">General Stream</option>
                <option value="Science">Science Stream</option>
                <option value="Commerce">Commerce Stream</option>
                <option value="Arts">Arts Stream</option>
                <option value="Vocational">Vocational Stream</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Saving..." : editingId ? "Update Class Master" : "Save Class to Database"}</span>
            </button>
          </div>
        </form>

        {/* Classes Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Configured Classes Directory
            </span>
            <span className="text-xs text-slate-500 font-mono">Sorted by Order</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-3">Order</th>
                  <th className="py-3 px-3">Class Name</th>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Stream</th>
                  <th className="py-3 px-3 text-center">Students</th>
                  <th className="py-3 px-3 text-center">Books</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {classList.map((c) => {
                  const studentCount = students.filter((s) => (s.class || "").toLowerCase().includes(c.name.toLowerCase())).length;
                  const bookCount = books.filter((b) => (b.class_name || "").toLowerCase().includes(c.name.toLowerCase())).length;

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">#{c.display_order || 99}</td>
                      <td className="py-3 px-3 font-extrabold text-white text-sm">{c.name}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{c.code || "N/A"}</td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-950 border border-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-md text-[10px]">
                          {c.stream || "General"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">{studentCount}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-blue-400">{bookCount}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-950 rounded-lg border border-slate-800"
                            title="Edit Class"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete class "${c.name}" from database?`)) {
                                onDeleteClass(c.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-950 rounded-lg border border-slate-800"
                            title="Delete Class"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
