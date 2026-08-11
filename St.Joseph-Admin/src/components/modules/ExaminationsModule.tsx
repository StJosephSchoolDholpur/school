import React, { useState } from "react";
import { Student, ExamMarkRecord } from "../../lib/db";
import { FileSpreadsheet, Award, Printer, Search, Plus, Save, Sparkles } from "lucide-react";

interface ExaminationsModuleProps {
  students: Student[];
  examMarks: ExamMarkRecord[];
  onSaveMarks: (records: ExamMarkRecord[]) => Promise<void>;
  onSelectPrintReportCard: (student: Student) => void;
}

export const ExaminationsModule: React.FC<ExaminationsModuleProps> = ({
  students,
  examMarks,
  onSaveMarks,
  onSelectPrintReportCard
}) => {
  const [selectedClass, setSelectedClass] = useState("Class X");
  const [selectedExamTerm, setSelectedExamTerm] = useState("Half Yearly Examination 2026");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      (s.class || "Class Nursery") === selectedClass &&
      ((s.name || s.student_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.admission_no || s.roll_no || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-amber-400" /> Examinations & Report Card Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill subject marks for Half Yearly/Annual exams and generate official CBSE marksheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs font-bold focus:border-amber-400 focus:outline-none"
          >
            {[
              "Class Nursery", "Class LKG", "Class UKG", "Class I", "Class II", "Class III",
              "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X",
              "Class XI (Science)", "Class XI (Commerce)", "Class XI (Arts)",
              "Class XII (Science)", "Class XII (Commerce)", "Class XII (Arts)"
            ].map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={selectedExamTerm}
            onChange={(e) => setSelectedExamTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-amber-400 font-bold rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="Unit Test 1 (2026)">Unit Test 1 (2026)</option>
            <option value="Half Yearly Examination 2026">Half Yearly Examination 2026</option>
            <option value="Unit Test 2 (2026)">Unit Test 2 (2026)</option>
            <option value="Annual Examination 2026">Annual Examination 2026</option>
          </select>
        </div>
      </div>

      {/* Student Marks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Student Marksheet Roster — {selectedClass}
          </h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500"
            />
          </div>
        </div>

        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-4 px-4">SR No</th>
              <th className="py-4 px-4">Student Profile</th>
              <th className="py-4 px-4">Class</th>
              <th className="py-4 px-4">Marks Status</th>
              <th className="py-4 px-4 text-right">Report Card Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredStudents.map((student) => {
              const studentName = student.student_name || student.name || "Student";
              const srNo = student.admission_no || student.roll_no || student.id.substring(0, 6);

              return (
                <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-amber-400">{srNo}</td>
                  <td className="py-4 px-4 font-extrabold text-white">{studentName}</td>
                  <td className="py-4 px-4 text-slate-400">{student.class} - {student.section || "A"}</td>
                  <td className="py-4 px-4">
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] px-2.5 py-1 rounded-full">
                      Marks Entered ✓
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onSelectPrintReportCard(student)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 ml-auto shadow-md transition-all hover:scale-105"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Marksheet PDF</span>
                    </button>
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
