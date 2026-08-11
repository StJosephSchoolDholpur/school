import React, { useState } from "react";
import { ClassEntity, Student, BookItem } from "../../lib/db";
import { Layers, Plus, Trash2, Edit3, Sparkles } from "lucide-react";

interface ClassManagementModuleProps {
  classList: ClassEntity[];
  students: Student[];
  books: BookItem[];
  onSaveClass: (c: Omit<ClassEntity, "id"> & { id?: string }) => Promise<void>;
  onDeleteClass: (id: string) => Promise<void>;
  onSeedClasses?: () => Promise<void>;
  onClearClasses?: () => Promise<void>;
}

const normalizeClassKey = (clsName: string): string => {
  if (!clsName) return "";
  let clean = clsName.toLowerCase().replace(/class/g, "").replace(/\s+/g, "").trim();
  clean = clean.replace(/[-_][a-z0-9]/g, "");
  clean = clean.replace(/\(science\)/g, "").replace(/\(commerce\)/g, "").replace(/\(arts\)/g, "");

  const romanMap: Record<string, string> = {
    "pg": "pg",
    "nursery": "nursery",
    "lkg": "lkg",
    "ukg": "ukg",
    "i": "1",
    "ii": "2",
    "iii": "3",
    "iv": "4",
    "v": "5",
    "vi": "6",
    "vii": "7",
    "viii": "8",
    "ix": "9",
    "x": "10",
    "xi": "11",
    "xii": "12"
  };

  if (romanMap[clean]) return romanMap[clean];
  return clean.replace(/st|nd|rd|th/g, "");
};

const isSameClass = (clsA: string, clsB: string): boolean => {
  if (!clsA || !clsB) return false;
  const normA = normalizeClassKey(clsA);
  const normB = normalizeClassKey(clsB);
  if (normA && normB && normA === normB) return true;
  return clsA.toLowerCase().trim() === clsB.toLowerCase().trim();
};

export const ClassManagementModule: React.FC<ClassManagementModuleProps> = ({
  classList,
  students,
  books,
  onSaveClass,
  onDeleteClass,
  onSeedClasses,
  onClearClasses
}) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    stream: "General",
    display_order: classList.length + 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
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

  const handleSeedClick = async () => {
    if (!onSeedClasses) return;
    if (confirm("Seed default 20 school classes (Class PG to Class XII) into the database?")) {
      setIsSeeding(true);
      try {
        await onSeedClasses();
      } catch (err) {
        console.error("Seed error:", err);
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const handleClearClick = async () => {
    if (!onClearClasses) return;
    if (confirm("Are you sure you want to WIPE ALL CLASSES from the database table?")) {
      setIsClearing(true);
      try {
        await onClearClasses();
      } catch (err) {
        console.error("Clear error:", err);
      } finally {
        setIsClearing(false);
      }
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
            Manage school classes dynamically in the database. Add custom classes or seed initial standard classes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {classList.length > 0 && onClearClasses && (
            <button
              onClick={handleClearClick}
              disabled={isClearing}
              className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>{isClearing ? "Wiping..." : "Wipe All Classes (Clear Table)"}</span>
            </button>
          )}

          {onSeedClasses && (
            <button
              onClick={handleSeedClick}
              disabled={isSeeding}
              className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isSeeding ? "Seeding..." : "+ Seed 20 Standard Classes"}</span>
            </button>
          )}

          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs">
            Active Classes: {classList.length} Configured
          </div>
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
                placeholder="e.g. Class PG, Class Nursery, Class 11 CS *"
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
                  placeholder="e.g. 10 or PG"
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

          {classList.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Classes Found in Database</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Add a class using the form on the left, or click below to populate the standard 20 school classes.
              </p>
              {onSeedClasses && (
                <button
                  onClick={handleSeedClick}
                  disabled={isSeeding}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSeeding ? "Seeding..." : "Seed 20 Standard Classes (PG to XII)"}</span>
                </button>
              )}
            </div>
          ) : (
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
                    const studentCount = students.filter((s) => isSameClass(s.class, c.name)).length;
                    const bookCount = books.filter((b) => isSameClass(b.class_name, c.name)).length;

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
          )}
        </div>
      </div>
    </div>
  );
};
