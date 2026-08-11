import React, { useState, useMemo } from "react";
import { Student, Teacher, AttendanceRecord, ClassEntity } from "../../lib/db";
import { UserCheck, Calendar, Save, CheckCircle, XCircle, Clock, Check, ArrowLeft, School, Users, ChevronRight } from "lucide-react";

interface AttendanceModuleProps {
  students: Student[];
  teachers: Teacher[];
  attendanceLogs: AttendanceRecord[];
  classList?: ClassEntity[];
  onSaveAttendance: (records: AttendanceRecord[]) => Promise<void>;
}

const DEFAULT_CLASSES = [
  "Class PG",
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

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  students,
  teachers,
  attendanceLogs,
  classList,
  onSaveAttendance
}) => {
  const activeClassNames = useMemo(() => {
    if (classList && classList.length > 0) {
      return classList.map((c) => c.name);
    }
    return DEFAULT_CLASSES;
  }, [classList]);

  const todayDateStr = new Date().toISOString().split("T")[0];
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [attendanceMode, setAttendanceMode] = useState<"students" | "teachers">("students");

  // Local attendance state for current marking session
  const [attendanceState, setAttendanceState] = useState<Record<string, "Present" | "Absent" | "Late" | "Leave">>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Group Students by Class
  const classStudentMap = useMemo(() => {
    const map: Record<string, Student[]> = {};
    activeClassNames.forEach((c) => {
      map[c] = [];
    });

    students.forEach((s) => {
      const clsName = s.class || activeClassNames[0] || "Class PG";
      const matched = activeClassNames.find((ac) => isSameClass(clsName, ac)) || clsName;
      if (!map[matched]) map[matched] = [];
      map[matched].push(s);
    });

    return map;
  }, [students, activeClassNames]);

  const currentClassStudents = useMemo(() => {
    if (!selectedClass) return [];
    return classStudentMap[selectedClass] || [];
  }, [selectedClass, classStudentMap]);

  const handleStatusChange = (id: string, status: "Present" | "Absent" | "Late" | "Leave") => {
    setAttendanceState((prev) => ({ ...prev, [id]: status }));
  };

  const handleMarkAllPresent = () => {
    const next: Record<string, "Present" | "Absent" | "Late" | "Leave"> = {};
    const targetList = attendanceMode === "students" ? currentClassStudents : teachers;
    targetList.forEach((item) => {
      next[item.id] = "Present";
    });
    setAttendanceState(next);
  };

  const handleSaveSubmit = async () => {
    setIsSaving(true);
    try {
      const recordsToSave: AttendanceRecord[] = [];
      const targetList = attendanceMode === "students" ? currentClassStudents : teachers;

      targetList.forEach((item) => {
        const st = attendanceState[item.id] || "Present";
        const studentName = (item as Student).student_name || item.name;
        recordsToSave.push({
          id: `att_${item.id}_${todayDateStr}`,
          student_id: item.id,
          student_name: studentName,
          class: attendanceMode === "students" ? (selectedClass || "General") : "Faculty",
          date: todayDateStr,
          status: st
        });
      });

      await onSaveAttendance(recordsToSave);
      setSuccessMessage("✅ Daily Attendance successfully saved & recorded!");
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      console.error("Attendance save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-amber-400" /> Daily Attendance Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select a class to mark daily student attendance or switch to teacher attendance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl text-xs font-mono text-amber-400 font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Today: {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
          </div>

          <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => {
                setAttendanceMode("students");
                setSelectedClass(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                attendanceMode === "students" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Class Students
            </button>
            <button
              onClick={() => {
                setAttendanceMode("teachers");
                setSelectedClass(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                attendanceMode === "teachers" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Faculty Teachers
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* VIEW 1: CLASS SELECTION GRID (Nested Structure) */}
      {attendanceMode === "students" && selectedClass === null && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <School className="w-4 h-4 text-amber-400" /> Select a Class to Open Attendance Register:
            </h3>
            <span className="text-xs text-slate-500 font-mono">{activeClassNames.length} Classes Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeClassNames.map((clsName) => {
              const classStudents = classStudentMap[clsName] || [];
              const todayLogForClass = attendanceLogs.filter((l) => isSameClass(l.class, clsName) && l.date === todayDateStr);
              const isMarked = todayLogForClass.length > 0;

              return (
                <div
                  key={clsName}
                  onClick={() => setSelectedClass(clsName)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl cursor-pointer group transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                        {clsName}
                      </span>
                      {isMarked ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" /> Marked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                          Pending
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors pt-1">
                      {clsName}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono font-bold text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {classStudents.length} Students
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MARK CLASS ATTENDANCE REGISTER */}
      {(attendanceMode === "teachers" || selectedClass !== null) && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {attendanceMode === "students" && (
                <button
                  onClick={() => setSelectedClass(null)}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>Back to Class List</span>
                </button>
              )}

              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-slate-400">Marking Attendance for:</span>
                <span className="text-amber-400 font-mono text-base font-extrabold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                  {attendanceMode === "students" ? selectedClass : "Faculty & Staff"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkAllPresent}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Mark All Present</span>
              </button>

              <button
                onClick={handleSaveSubmit}
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Attendance"}</span>
              </button>
            </div>
          </div>

          {/* Student/Teacher Attendance Marking Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            {((attendanceMode === "students" ? currentClassStudents : teachers).length === 0) ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-bold">No records found for this register.</p>
                <p className="text-xs">Add students to {selectedClass} in Student Management page.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">Name</th>
                      <th className="py-3.5 px-4">Roll / ID</th>
                      <th className="py-3.5 px-4">Class / Dept</th>
                      <th className="py-3.5 px-4 text-center">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(attendanceMode === "students" ? currentClassStudents : teachers).map((item, idx) => {
                      const currentStatus = attendanceState[item.id] || "Present";
                      const titleName = (item as Student).student_name || item.name;
                      const codeNo = (item as Student).roll_no || (item as Teacher).emp_id || (item as Student).admission_no || `ID-${idx + 1}`;
                      const subText = (item as Student).class || (item as Teacher).designation || "General";

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-white text-sm">{titleName}</td>
                          <td className="py-3 px-4 font-mono text-slate-400">{codeNo}</td>
                          <td className="py-3 px-4 text-slate-300">{subText}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.id, "Present")}
                                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                  currentStatus === "Present"
                                    ? "bg-emerald-500 text-slate-950 shadow-md"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.id, "Absent")}
                                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                  currentStatus === "Absent"
                                    ? "bg-rose-500 text-white shadow-md"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" /> Absent
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.id, "Late")}
                                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                  currentStatus === "Late"
                                    ? "bg-amber-500 text-slate-950 shadow-md"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5" /> Late
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.id, "Leave")}
                                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                  currentStatus === "Leave"
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                Leave
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
