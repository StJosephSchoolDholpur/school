import React, { useState, useMemo } from "react";
import { Student, Teacher, AttendanceRecord, ClassEntity } from "../../lib/db";
import { UserCheck, Calendar, Save, CheckCircle, XCircle, Clock, Check, ArrowLeft, School, Users, ChevronRight } from "lucide-react";
import { isStudentInClassObj } from "./StudentManagementModule";

interface AttendanceModuleProps {
  students: Student[];
  teachers: Teacher[];
  attendanceLogs: AttendanceRecord[];
  classList?: ClassEntity[];
  onSaveAttendance: (records: AttendanceRecord[]) => Promise<void>;
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

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  students,
  teachers,
  attendanceLogs,
  classList,
  onSaveAttendance
}) => {
  const activeClasses = useMemo(() => {
    if (classList && classList.length > 0) {
      return classList;
    }
    return DEFAULT_CLASSES;
  }, [classList]);

  const todayDateStr = new Date().toISOString().split("T")[0];
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [attendanceMode, setAttendanceMode] = useState<"students" | "teachers">("students");

  const selectedClassEntity = useMemo(() => {
    if (!selectedClassId) return null;
    return activeClasses.find((c) => c.id === selectedClassId) || null;
  }, [selectedClassId, activeClasses]);

  // Local attendance state for current marking session
  const [attendanceState, setAttendanceState] = useState<Record<string, "Present" | "Absent" | "Late" | "Leave">>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const currentClassStudents = useMemo(() => {
    if (!selectedClassEntity) return [];
    return students.filter((s) => isStudentInClassObj(s, selectedClassEntity));
  }, [selectedClassEntity, students]);

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
          class: attendanceMode === "students" ? (selectedClassEntity?.name || "General") : "Faculty",
          section: selectedClassEntity?.section || "A",
          date: todayDateStr,
          status: st,
          marked_by: "Admin",
          timestamp: new Date().toISOString()
        });
      });

      await onSaveAttendance(recordsToSave);
      setSuccessMessage(`Attendance saved successfully for ${targetList.length} ${attendanceMode}!`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Save attendance failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-amber-400" /> Daily Attendance Marking Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mark daily attendance section-wise for students or faculty teachers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => {
                setAttendanceMode("students");
                setSelectedClassId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                attendanceMode === "students"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Students Attendance
            </button>
            <button
              onClick={() => {
                setAttendanceMode("teachers");
                setSelectedClassId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                attendanceMode === "teachers"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
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

      {/* VIEW 1: CLASS SELECTION GRID */}
      {attendanceMode === "students" && selectedClassEntity === null && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <School className="w-4 h-4 text-amber-400" /> Select a Class to Open Attendance Register:
            </h3>
            <span className="text-xs text-slate-500 font-mono">{activeClasses.length} Classes Configured</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeClasses.map((c) => {
              const classStudents = students.filter((s) => isStudentInClassObj(s, c));
              const todayLogForClass = attendanceLogs.filter(
                (l) => isStudentInClassObj({ class: l.class, section: l.section || "A", id: "" } as any, c) && l.date === todayDateStr
              );
              const isMarked = todayLogForClass.length > 0;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClassId(c.id)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl cursor-pointer group transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                        Sec {c.section || "A"}
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
                      {c.name}
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

      {/* VIEW 2: MARKING REGISTER TABLE VIEW */}
      {(selectedClassEntity !== null || attendanceMode === "teachers") && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {/* Register Sub-Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              {attendanceMode === "students" && (
                <button
                  onClick={() => setSelectedClassId(null)}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Classes</span>
                </button>
              )}
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  {attendanceMode === "students" ? `${selectedClassEntity?.name} (Sec ${selectedClassEntity?.section || "A"}) Register` : "Faculty Teachers Register"}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Date: {todayDateStr}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkAllPresent}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Mark All Present</span>
              </button>

              <button
                onClick={handleSaveSubmit}
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Register"}</span>
              </button>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Roll / ID</th>
                  <th className="py-3.5 px-4 text-center">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(attendanceMode === "students" ? currentClassStudents : teachers).map((item, idx) => {
                  const currentStatus = attendanceState[item.id] || "Present";
                  const nameStr = (item as Student).student_name || item.name;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-extrabold text-white text-sm">{nameStr}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {(item as Student).admission_no || (item as Teacher).id || "N/A"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "Present")}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                              currentStatus === "Present"
                                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400"
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Present
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "Absent")}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                              currentStatus === "Absent"
                                ? "bg-red-500 text-white shadow-md font-extrabold"
                                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> Absent
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "Late")}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                              currentStatus === "Late"
                                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" /> Late
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
      )}
    </div>
  );
};
