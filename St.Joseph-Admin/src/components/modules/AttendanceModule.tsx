import React, { useState, useMemo } from "react";
import { Student, Teacher, AttendanceRecord, ClassEntity } from "../../lib/db";
import { UserCheck, Calendar, Filter, Save, CheckCircle, XCircle, Clock, Check } from "lucide-react";

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
  const [selectedClass, setSelectedClass] = useState("Class X");
  const [attendanceMode, setAttendanceMode] = useState<"students" | "teachers">("students");

  // Local attendance state for current marking session
  const [attendanceState, setAttendanceState] = useState<Record<string, "Present" | "Absent" | "Late" | "Leave">>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredStudents = students.filter((s) => (s.class || activeClassNames[0] || "Class PG") === selectedClass);

  const handleStatusChange = (id: string, status: "Present" | "Absent" | "Late" | "Leave") => {
    setAttendanceState((prev) => ({ ...prev, [id]: status }));
  };

  const handleMarkAllPresent = () => {
    const next: Record<string, "Present" | "Absent" | "Late" | "Leave"> = {};
    const targetList = attendanceMode === "students" ? filteredStudents : teachers;
    targetList.forEach((item) => {
      next[item.id] = "Present";
    });
    setAttendanceState(next);
  };

  const handleSaveSubmit = async () => {
    setIsSaving(true);
    try {
      const recordsToSave: AttendanceRecord[] = [];
      const targetList = attendanceMode === "students" ? filteredStudents : teachers;

      targetList.forEach((item) => {
        const st = attendanceState[item.id] || "Present";
        const studentName = (item as Student).student_name || item.name;
        recordsToSave.push({
          id: `att_${item.id}_${todayDateStr}`,
          student_id: item.id,
          student_name: studentName,
          class: attendanceMode === "students" ? selectedClass : "Faculty",
          date: todayDateStr,
          status: st
        });
      });

      await onSaveAttendance(recordsToSave);
      setSuccessMessage("✅ Attendance successfully saved!");
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
            <UserCheck className="w-6 h-6 text-amber-400" /> Daily Attendance Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mark daily Present, Absent, Late, or Leave status for students & faculty members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl text-xs font-mono text-amber-400 font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Today: {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
          </div>

          <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setAttendanceMode("students")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                attendanceMode === "students" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setAttendanceMode("teachers")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                attendanceMode === "teachers" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Teachers
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

      {/* Mode Controls */}
      {attendanceMode === "students" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300 font-bold">Select Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-amber-400 focus:outline-none"
            >
              {activeClassNames.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
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
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Attendance"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-4 px-4">SR / Roll No</th>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Class / Role</th>
              <th className="py-4 px-4 text-center">Status Selection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {(attendanceMode === "students" ? filteredStudents : teachers).map((item) => {
              const currentStatus = attendanceState[item.id] || "Present";
              const itemName = (item as Student).student_name || item.name;
              const itemSub = (item as Student).admission_no || (item as Teacher).emp_id || item.id.substring(0, 6);

              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-amber-400">{itemSub}</td>
                  <td className="py-4 px-4 font-extrabold text-white">{itemName}</td>
                  <td className="py-4 px-4 text-slate-400">
                    {attendanceMode === "students" ? (item as Student).class : (item as Teacher).designation}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {(["Present", "Absent", "Late", "Leave"] as const).map((st) => {
                        const isSelected = currentStatus === st;
                        const badgeColors = {
                          Present: isSelected ? "bg-emerald-500 text-slate-950 font-extrabold" : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white",
                          Absent: isSelected ? "bg-red-500 text-white font-extrabold" : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white",
                          Late: isSelected ? "bg-amber-500 text-slate-950 font-extrabold" : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white",
                          Leave: isSelected ? "bg-blue-500 text-white font-extrabold" : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                        };

                        return (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(item.id, st)}
                            className={`px-3 py-1.5 rounded-xl text-xs transition-all ${badgeColors[st]}`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
