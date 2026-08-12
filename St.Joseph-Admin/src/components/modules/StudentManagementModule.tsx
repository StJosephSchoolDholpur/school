import React, { useState, useMemo } from "react";
import { Student, ClassEntity } from "../../lib/db";
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  Trash2,
  Edit3,
  Phone,
  UserCheck,
  Filter,
  Calendar,
  Sparkles
} from "lucide-react";

interface StudentManagementModuleProps {
  students: Student[];
  classList?: ClassEntity[];
  onSaveStudent: (student: Omit<Student, "id"> & { id?: string }) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onOpenAdmissionModal: () => void;
  onEditStudent?: (student: Student) => void;
}

const DEFAULT_CLASSES: ClassEntity[] = [
  { id: "cls_pg", name: "Class PG", section: "A" },
  { id: "cls_nur", name: "Class Nursery", section: "A" },
  { id: "cls_lkg", name: "Class LKG", section: "A" },
  { id: "cls_ukg", name: "Class UKG", section: "A" },
  { id: "cls_1", name: "Class I", section: "A" },
  { id: "cls_2", name: "Class II", section: "A" },
  { id: "cls_3", name: "Class III", section: "A" },
  { id: "cls_4", name: "Class IV", section: "A" },
  { id: "cls_5", name: "Class V", section: "A" },
  { id: "cls_6", name: "Class VI", section: "A" },
  { id: "cls_7", name: "Class VII", section: "A" },
  { id: "cls_8", name: "Class VIII", section: "A" },
  { id: "cls_9", name: "Class IX", section: "A" },
  { id: "cls_10", name: "Class X", section: "A" }
];

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

export const isStudentInClassObj = (s: Student, c: ClassEntity): boolean => {
  if (s.class_id && s.class_id === c.id) return true;
  const matchClass = isSameClass(s.class, c.name);
  if (!matchClass) return false;
  const studentSec = (s.section || "A").trim().toUpperCase();
  const classSec = (c.section || "A").trim().toUpperCase();
  return studentSec === classSec;
};

export const StudentManagementModule: React.FC<StudentManagementModuleProps> = ({
  students,
  classList,
  onSaveStudent,
  onDeleteStudent,
  onOpenAdmissionModal,
  onEditStudent
}) => {
  const activeClasses = useMemo(() => {
    if (classList && classList.length > 0) {
      return classList;
    }
    return DEFAULT_CLASSES;
  }, [classList]);

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All");

  const selectedClassEntity = useMemo(() => {
    if (!selectedClassId) return null;
    return activeClasses.find((c) => c.id === selectedClassId) || null;
  }, [selectedClassId, activeClasses]);

  // Inline Quick Add Student Form State
  const [quickStudent, setQuickStudent] = useState({
    name: "",
    dob: "",
    father_name: "",
    parent_mobile: "",
    section: "A"
  });
  const [isAddingQuick, setIsAddingQuick] = useState(false);

  // Group Students Class-Wise using strict class + section matching
  const classStats = useMemo(() => {
    const map: Record<string, { total: number; students: Student[] }> = {};

    activeClasses.forEach((c) => {
      const classStudents = students.filter((s) => isStudentInClassObj(s, c));
      map[c.id] = {
        total: classStudents.length,
        students: classStudents
      };
    });

    return map;
  }, [students, activeClasses]);

  // Filtered Students for the selected class view
  const currentClassStudents = useMemo(() => {
    if (!selectedClassEntity) return [];
    const classData = classStats[selectedClassEntity.id]?.students || [];

    return classData.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        (s.name || s.student_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.admission_no || s.roll_no || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.father_name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSection = sectionFilter === "All" || (s.section || "A").toUpperCase() === sectionFilter.toUpperCase();

      return matchesSearch && matchesSection;
    });
  }, [selectedClassEntity, classStats, searchQuery, sectionFilter]);

  // Handle Quick Add Submit
  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassEntity || !quickStudent.name.trim()) return;

    setIsAddingQuick(true);
    try {
      await onSaveStudent({
        class: selectedClassEntity.name,
        class_id: selectedClassEntity.id,
        class_code: selectedClassEntity.code,
        name: quickStudent.name.trim(),
        student_name: quickStudent.name.trim(),
        dob: quickStudent.dob || "2020-01-01",
        father_name: quickStudent.father_name.trim(),
        parent_mobile: quickStudent.parent_mobile.trim(),
        section: quickStudent.section || selectedClassEntity.section || "A",
        active_status: true
      });
      setQuickStudent({ name: "", dob: "", father_name: "", parent_mobile: "", section: "A" });
    } catch (err) {
      console.error("Failed to quick add student:", err);
    } finally {
      setIsAddingQuick(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── SCREEN 1: CLASS CARDS SELECTION GRID ─── */}
      {!selectedClassEntity ? (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
                <Users className="w-6 h-6 text-amber-400" /> Class-Wise Student Directory
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a class section to view its complete student roster, registration details, and roll list.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search any student across classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none w-64"
                />
              </div>

              {/* Total Badge */}
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Total Enrolled: {students.length} Students</span>
              </div>

              {/* Add Student Admission FAB Trigger */}
              <button
                onClick={onOpenAdmissionModal}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Admission Form</span>
              </button>
            </div>
          </div>

          {/* Grid of Class Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {activeClasses.map((c) => {
              const stat = classStats[c.id] || { total: 0, students: [] };
              const secLabel = c.section || "A";

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedClassId(c.id);
                    setSearchQuery("");
                    setSectionFilter(secLabel);
                  }}
                  className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Subtle Accent Glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/15 transition-all" />

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center font-extrabold text-base group-hover:border-amber-400/50 transition-all">
                        🎓
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-full">
                        Sec: {secLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Code: {c.code || c.name.replace(/class/i, "").trim()}
                      </p>
                      {c.class_teacher_name && (
                        <p className="text-[11px] text-emerald-400 font-bold mt-1">
                          Teacher: {c.class_teacher_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-xl font-extrabold text-amber-400 font-mono">
                        {stat.total}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1.5 font-bold">Enrolled</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Roster →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ─── SCREEN 2: SELECTED CLASS STUDENT ROSTER VIEW ─── */
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Header Navigation & Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedClassId(null);
                    setSearchQuery("");
                  }}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all flex items-center gap-2 text-xs font-bold shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Classes</span>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-heading font-extrabold text-white">
                      {selectedClassEntity.name}
                    </h2>
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg">
                      Sec {selectedClassEntity.section || "A"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Viewing enrolled students list for {selectedClassEntity.name} (Section {selectedClassEntity.section || "A"}).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student name, roll no, father..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none w-60"
                  />
                </div>

                <button
                  onClick={onOpenAdmissionModal}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Full Admission Form</span>
                </button>
              </div>
            </div>

            {/* Quick Add Student Inline Bar */}
            <form
              onSubmit={handleQuickAddSubmit}
              className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3"
            >
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs shrink-0">
                <Sparkles className="w-4 h-4" />
                <span>Quick Add Student:</span>
              </div>
              <input
                type="text"
                placeholder="Student Full Name *"
                value={quickStudent.name}
                onChange={(e) => setQuickStudent({ ...quickStudent, name: e.target.value })}
                required
                className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 flex-1 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Father's Name"
                value={quickStudent.father_name}
                onChange={(e) => setQuickStudent({ ...quickStudent, father_name: e.target.value })}
                className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 flex-1 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Mobile No."
                value={quickStudent.parent_mobile}
                onChange={(e) => setQuickStudent({ ...quickStudent, parent_mobile: e.target.value })}
                className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 w-32 focus:border-amber-400 focus:outline-none font-mono"
              />
              <input
                type="date"
                value={quickStudent.dob}
                onChange={(e) => setQuickStudent({ ...quickStudent, dob: e.target.value })}
                className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 w-36 focus:border-amber-400 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={isAddingQuick}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition-all shrink-0"
              >
                {isAddingQuick ? "Adding..." : "+ Quick Save"}
              </button>
            </form>
          </div>

          {/* Student Roster Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> Roster List ({currentClassStudents.length} Students)
              </h3>
            </div>

            {currentClassStudents.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No Students Found in {selectedClassEntity.name} (Sec {selectedClassEntity.section || "A"})</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Use the Quick Add bar above or click "+ Full Admission Form" to register students.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Student Details</th>
                      <th className="py-3.5 px-4">Class & Sec</th>
                      <th className="py-3.5 px-4">D.O.B</th>
                      <th className="py-3.5 px-4">Father Name</th>
                      <th className="py-3.5 px-4">Contact Phone</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {currentClassStudents.map((student) => {
                      const studentName = student.name || student.student_name || "Unnamed Student";

                      return (
                        <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  student.photo_url ||
                                  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
                                }
                                alt={studentName}
                                className="w-9 h-9 rounded-xl object-cover border border-amber-500/30 shrink-0"
                              />
                              <div>
                                <span className="font-extrabold text-white text-sm block">
                                  {studentName}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  S.No / Adm: {student.admission_no || "N/A"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-slate-950 border border-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-lg">
                              {student.class} - {student.section || "A"}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span>{student.dob || "2015-01-01"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-slate-300">
                            {student.father_name || "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{student.parent_mobile || student.whatsapp_no || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                              Active ✓
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {onEditStudent && (
                                <button
                                  onClick={() => onEditStudent(student)}
                                  className="p-2 text-slate-400 hover:text-amber-400 bg-slate-950 hover:bg-amber-500/10 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-all"
                                  title="Edit Student Profile"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${studentName}?`)) {
                                    onDeleteStudent(student.id);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-red-400 bg-slate-950 hover:bg-red-500/10 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all"
                                title="Delete Student Record"
                              >
                                <Trash2 className="w-4 h-4" />
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
      )}
    </div>
  );
};
