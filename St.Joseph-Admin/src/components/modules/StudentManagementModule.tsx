import React, { useState, useMemo } from "react";
import { Student } from "../../lib/db";
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  Trash2,
  Phone,
  UserCheck,
  Filter,
  Calendar,
  Sparkles
} from "lucide-react";

interface StudentManagementModuleProps {
  students: Student[];
  onSaveStudent: (student: Omit<Student, "id"> & { id?: string }) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onOpenAdmissionModal: () => void;
}

const ALL_CLASSES = [
  "Class Nursery",
  "Class LKG",
  "Class UKG",
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
  "Class X",
  "Class XI (Science)",
  "Class XI (Commerce)",
  "Class XI (Arts)",
  "Class XII (Science)",
  "Class XII (Commerce)",
  "Class XII (Arts)"
];

export const StudentManagementModule: React.FC<StudentManagementModuleProps> = ({
  students,
  onSaveStudent,
  onDeleteStudent,
  onOpenAdmissionModal
}) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All");

  // Inline Quick Add Student Form State
  const [quickStudent, setQuickStudent] = useState({
    name: "",
    dob: "",
    father_name: "",
    parent_mobile: "",
    section: "A"
  });
  const [isAddingQuick, setIsAddingQuick] = useState(false);

  // Group Students Class-Wise
  const classStats = useMemo(() => {
    const map: Record<string, { total: number; sections: Set<string>; students: Student[] }> = {};

    // Initialize all default classes
    ALL_CLASSES.forEach((c) => {
      map[c] = { total: 0, sections: new Set(["A"]), students: [] };
    });

    // Populate with actual students
    students.forEach((s) => {
      const clsName = s.class || "Class Nursery";
      if (!map[clsName]) {
        map[clsName] = { total: 0, sections: new Set(["A"]), students: [] };
      }
      map[clsName].total += 1;
      if (s.section) map[clsName].sections.add(s.section);
      map[clsName].students.push(s);
    });

    return map;
  }, [students]);

  // Filtered Students for the selected class view
  const currentClassStudents = useMemo(() => {
    if (!selectedClass) return [];
    const classData = classStats[selectedClass]?.students || [];

    return classData.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        (s.name || s.student_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.admission_no || s.roll_no || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.father_name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSection = sectionFilter === "All" || (s.section || "A") === sectionFilter;

      return matchesSearch && matchesSection;
    });
  }, [selectedClass, classStats, searchQuery, sectionFilter]);

  // Handle Quick Add Submit
  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !quickStudent.name.trim()) return;

    setIsAddingQuick(true);
    try {
      await onSaveStudent({
        class: selectedClass,
        name: quickStudent.name.trim(),
        student_name: quickStudent.name.trim(),
        dob: quickStudent.dob || "2020-01-01",
        father_name: quickStudent.father_name.trim(),
        parent_mobile: quickStudent.parent_mobile.trim(),
        section: quickStudent.section,
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
      {!selectedClass ? (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
                <Users className="w-6 h-6 text-amber-400" /> Class-Wise Student Directory
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a class to view its complete student roster, registration details, and roll list.
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
            {ALL_CLASSES.map((clsName) => {
              const stat = classStats[clsName] || { total: 0, sections: new Set(["A"]), students: [] };
              const sectionsList = Array.from(stat.sections).join(", ");

              return (
                <div
                  key={clsName}
                  onClick={() => {
                    setSelectedClass(clsName);
                    setSearchQuery("");
                    setSectionFilter("All");
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
                        Sec: {sectionsList}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading font-extrabold text-base text-white group-hover:text-amber-400 transition-colors">
                        {clsName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">St. Joseph International School</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-xl font-extrabold text-white">{stat.total}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-medium">Students</span>
                    </div>

                    <div className="bg-amber-500/10 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                      <span>View Class ➔</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ─── SCREEN 2: FULL CLASS STUDENT TABLE VIEW ─── */
        <div className="space-y-6">
          {/* Class Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedClass(null)}
                className="bg-slate-950 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Back to All Classes</span>
              </button>

              <div>
                <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
                  <span>{selectedClass}</span>
                  <span className="text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
                    {currentClassStudents.length} Registered Students
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete student directory, roll roster, and contact information for {selectedClass}.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Section Filter */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 border border-slate-800 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <span className="text-slate-400 font-medium">Sec:</span>
                {["All", "A", "B", "C"].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setSectionFilter(sec)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      sectionFilter === sec
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>

              {/* Search Within Class */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in this class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none w-48"
                />
              </div>

              <button
                onClick={onOpenAdmissionModal}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* Quick Inline Student Add Form for Selected Class */}
          <form
            onSubmit={handleQuickAddSubmit}
            className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-3"
          >
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Quick Register Student to {selectedClass}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Student Full Name *"
                value={quickStudent.name}
                onChange={(e) => setQuickStudent({ ...quickStudent, name: e.target.value })}
                required
                className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="date"
                value={quickStudent.dob}
                onChange={(e) => setQuickStudent({ ...quickStudent, dob: e.target.value })}
                required
                className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Father's Name *"
                value={quickStudent.father_name}
                onChange={(e) => setQuickStudent({ ...quickStudent, father_name: e.target.value })}
                required
                className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Parent Mobile / WhatsApp *"
                value={quickStudent.parent_mobile}
                onChange={(e) => setQuickStudent({ ...quickStudent, parent_mobile: e.target.value })}
                required
                className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAddingQuick}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingQuick ? "Saving..." : "Quick Add"}</span>
              </button>
            </div>
          </form>

          {/* Student Complete Data Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {currentClassStudents.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No Students Registered in {selectedClass}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "+ Add Admission Form" or use Quick Register above to add students to this class.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-4">SR / Roll No</th>
                      <th className="py-4 px-4">Student Profile</th>
                      <th className="py-4 px-4">Class & Sec</th>
                      <th className="py-4 px-4">Date of Birth</th>
                      <th className="py-4 px-4">Father Name</th>
                      <th className="py-4 px-4">Parent Mobile</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {currentClassStudents.map((student) => {
                      const studentName = student.student_name || student.name || "Student";
                      const srNo = student.admission_no || student.roll_no || student.form_no || student.id.substring(0, 6);

                      return (
                        <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-amber-400">
                            {srNo}
                          </td>
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
                                  Form: {student.form_no || "N/A"}
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
