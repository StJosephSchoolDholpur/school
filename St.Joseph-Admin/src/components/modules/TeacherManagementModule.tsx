import React, { useState } from "react";
import { Teacher } from "../../lib/db";
import { GraduationCap, Plus, Search, Trash2, Phone, Mail, Award, Calendar } from "lucide-react";
import { TeacherRegistrationModal } from "../TeacherRegistrationModal";

interface TeacherManagementModuleProps {
  teachers: Teacher[];
  onSaveTeacher: (t: Omit<Teacher, "id"> & { id?: string }) => Promise<void>;
  onDeleteTeacher: (id: string) => Promise<void>;
}

export const TeacherManagementModule: React.FC<TeacherManagementModuleProps> = ({
  teachers,
  onSaveTeacher,
  onDeleteTeacher
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTeachers = teachers.filter((t) => {
    return (
      searchQuery === "" ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.department || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.phone || "").includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-amber-400" /> Faculty & Teacher Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage faculty profiles, designations, academic qualifications, and birthday records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search teacher name, subject, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none w-64"
            />
          </div>

          <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === "cards" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === "table" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Teacher Profile</span>
          </button>
        </div>
      </div>

      {/* Cards View Mode */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        teacher.photo_url ||
                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={teacher.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/30 shrink-0"
                    />
                    <div>
                      <h3 className="font-heading font-extrabold text-base text-white">{teacher.name}</h3>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md inline-block mt-1">
                        {teacher.designation}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-400 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <p className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dept: <strong className="text-slate-200">{teacher.department || "General"}</strong></span>
                  </p>
                  {teacher.phone && (
                    <p className="flex items-center gap-2 text-emerald-400 font-mono">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{teacher.phone}</span>
                    </p>
                  )}
                  {teacher.email && (
                    <p className="flex items-center gap-2 text-blue-400">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{teacher.email}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>DOB: <strong className="text-slate-300 font-mono">{teacher.dob}</strong></span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">ID: {teacher.emp_id || teacher.id.substring(0, 8)}</span>
                <button
                  onClick={() => {
                    if (confirm(`Delete teacher profile ${teacher.name}?`)) {
                      onDeleteTeacher(teacher.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 bg-slate-950 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all"
                  title="Delete Teacher Profile"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View Mode */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-4">Faculty Member</th>
                <th className="py-4 px-4">Designation</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Phone / WhatsApp</th>
                <th className="py-4 px-4">DOB</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          teacher.photo_url ||
                          "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
                        }
                        alt={teacher.name}
                        className="w-9 h-9 rounded-xl object-cover border border-amber-500/30 shrink-0"
                      />
                      <span className="font-extrabold text-white text-sm">{teacher.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-amber-400">{teacher.designation}</td>
                  <td className="py-4 px-4 text-slate-400">{teacher.department || "General"}</td>
                  <td className="py-4 px-4 text-emerald-400 font-mono">{teacher.phone || "N/A"}</td>
                  <td className="py-4 px-4 font-mono text-slate-400">{teacher.dob}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Delete teacher profile ${teacher.name}?`)) {
                          onDeleteTeacher(teacher.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-400 bg-slate-950 rounded-xl border border-slate-800 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Teacher Registration Modal */}
      <TeacherRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTeacher={onSaveTeacher}
      />
    </div>
  );
};
