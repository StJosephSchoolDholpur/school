import React, { useState, useMemo } from "react";
import { ClassEntity, Student, BookItem, Teacher } from "../../lib/db";
import { Layers, Plus, Trash2, Edit3, Sparkles, UserCheck, X, Check } from "lucide-react";

interface ClassManagementModuleProps {
  classList: ClassEntity[];
  students: Student[];
  books: BookItem[];
  teachers?: Teacher[];
  onSaveClass: (c: Omit<ClassEntity, "id"> & { id?: string }) => Promise<void>;
  onDeleteClass: (id: string) => Promise<void>;
  onSeedClasses?: () => Promise<void>;
  onClearClasses?: () => Promise<void>;
}

const normalizeClassKey = (clsName: string): string => {
  if (!clsName) return "";
  let clean = clsName.toLowerCase().replace(/class/g, "").replace(/\s+/g, "").trim();
  clean = clean.replace(/[-_][a-z0-9]/g, "");

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
    "x": "10"
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

const getAutoDisplayOrder = (name: string, currentLength: number): number => {
  const norm = normalizeClassKey(name);
  const orderMap: Record<string, number> = {
    "pg": 1,
    "nursery": 2,
    "lkg": 3,
    "ukg": 4,
    "1": 5,
    "2": 6,
    "3": 7,
    "4": 8,
    "5": 9,
    "6": 10,
    "7": 11,
    "8": 12,
    "9": 13,
    "10": 14
  };
  return orderMap[norm] || currentLength + 1;
};

export const ClassManagementModule: React.FC<ClassManagementModuleProps> = ({
  classList,
  students,
  books,
  teachers = [],
  onSaveClass,
  onDeleteClass,
  onSeedClasses,
  onClearClasses
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    class_teacher_id: ""
  });

  // Calculate teachers already assigned as class teacher (1 Teacher = 1 Class rule)
  const assignedTeacherMap = useMemo(() => {
    const map: Record<string, string> = {}; // teacherId -> className
    classList.forEach((c) => {
      if (c.class_teacher_id) {
        map[c.class_teacher_id] = c.name;
      }
    });
    return map;
  }, [classList]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setForm({ name: "", code: "", class_teacher_id: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: ClassEntity) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      code: c.code || "",
      class_teacher_id: c.class_teacher_id || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const selectedTeacher = teachers.find((t) => t.id === form.class_teacher_id);
    const autoOrder = getAutoDisplayOrder(form.name, classList.length);

    setIsSubmitting(true);
    try {
      await onSaveClass({
        id: editingId || undefined,
        name: form.name.trim(),
        code: form.code.trim() || form.name.replace(/class/i, "").trim(),
        display_order: autoOrder,
        class_teacher_id: form.class_teacher_id || undefined,
        class_teacher_name: selectedTeacher ? selectedTeacher.name : undefined,
        is_active: true
      });
      setForm({ name: "", code: "", class_teacher_id: "" });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save class error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeedClick = async () => {
    if (!onSeedClasses) return;
    if (confirm("Seed default 14 school classes (Class PG to Class X) into the database?")) {
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" /> Class Master Database Setup
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure school classes (Class PG to Class X) and assign dedicated Class Teachers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Class</span>
          </button>

          {classList.length > 0 && onClearClasses && (
            <button
              onClick={handleClearClick}
              disabled={isClearing}
              className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>{isClearing ? "Wiping..." : "Wipe All Classes"}</span>
            </button>
          )}

          {onSeedClasses && (
            <button
              onClick={handleSeedClick}
              disabled={isSeeding}
              className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isSeeding ? "Seeding..." : "+ Seed Standard Classes"}</span>
            </button>
          )}

          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs">
            Active Classes: {classList.length} Configured
          </div>
        </div>
      </div>

      {/* Classes Directory Table (Full Width 100%) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-extrabold text-sm text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" /> Configured Classes Directory (PG to 10th)
          </span>
          <span className="text-xs text-slate-500 font-mono">Sorted Automatically</span>
        </h3>

        {classList.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No Classes Found in Database</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Click "+ Add New Class" above to create custom classes or click seed below to populate standard school classes.
            </p>
            {onSeedClasses && (
              <button
                onClick={handleSeedClick}
                disabled={isSeeding}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSeeding ? "Seeding..." : "Seed Standard Classes (PG to X)"}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Class Name</th>
                  <th className="py-3.5 px-4">Class Code</th>
                  <th className="py-3.5 px-4">Class Teacher</th>
                  <th className="py-3.5 px-4 text-center">Enrolled Students</th>
                  <th className="py-3.5 px-4 text-center">Book List</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {classList.map((c) => {
                  const studentCount = students.filter((s) => isSameClass(s.class, c.name)).length;
                  const bookCount = books.filter((b) => isSameClass(b.class_name, c.name)).length;

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">#{c.display_order || 99}</td>
                      <td className="py-3.5 px-4 font-extrabold text-white text-sm">{c.name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{c.code || "N/A"}</td>
                      <td className="py-3.5 px-4">
                        {c.class_teacher_name ? (
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 text-xs">
                            <UserCheck className="w-3.5 h-3.5" />
                            {c.class_teacher_name}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-bold text-xs italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">{studentCount}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-400">{bookCount}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(c)}
                            className="p-2 text-slate-400 hover:text-amber-400 bg-slate-950 rounded-xl border border-slate-800 transition-all"
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
                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-950 rounded-xl border border-slate-800 transition-all"
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

      {/* ADD / EDIT CLASS MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                {editingId ? "Edit Class Setup" : "Add New School Class"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Class Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Class 5 or Class V"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Class Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 5"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">
                  Assign Class Teacher (1 Teacher per Class)
                </label>
                <select
                  value={form.class_teacher_id}
                  onChange={(e) => setForm({ ...form, class_teacher_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:border-amber-400 focus:outline-none"
                >
                  <option value="">-- Select Class Teacher --</option>
                  {teachers.map((t) => {
                    const assignedToClass = assignedTeacherMap[t.id];
                    const isAssignedToOther = assignedToClass && assignedToClass !== form.name;

                    return (
                      <option
                        key={t.id}
                        value={t.id}
                        disabled={!!isAssignedToOther}
                      >
                        {t.name} ({t.designation || "Teacher"}) {isAssignedToOther ? `[Assigned to ${assignedToClass}]` : ""}
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Note: A teacher already assigned as Class Teacher to another class cannot be selected.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Class" : "Save Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
