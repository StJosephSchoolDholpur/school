import React, { useState } from "react";
import { TCRecordData } from "../../lib/db";
import { FileCheck2, Search, Upload, Plus, Trash2, FileText } from "lucide-react";

interface TcPortalModuleProps {
  tcs: TCRecordData[];
  onUploadAndSaveTC: (file: File | null, record: Omit<TCRecordData, "id" | "file_path" | "file_url" | "created_at">) => Promise<void>;
  onDeleteTC: (id: string) => Promise<void>;
}

export const TcPortalModule: React.FC<TcPortalModuleProps> = ({ tcs, onUploadAndSaveTC, onDeleteTC }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    roll_no: "",
    class: "Class X",
    student_name: "",
    father_name: "",
    dob: "",
    tc_number: `TC-2026-${Math.floor(100 + Math.random() * 900)}`,
    issue_date: new Date().toISOString().split("T")[0]
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredTcs = tcs.filter(
    (tc) =>
      searchQuery === "" ||
      tc.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.tc_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_name || !form.tc_number) return;

    setIsUploading(true);
    try {
      await onUploadAndSaveTC(selectedFile, form);
      setForm({
        roll_no: "",
        class: "Class X",
        student_name: "",
        father_name: "",
        dob: "",
        tc_number: `TC-2026-${Math.floor(100 + Math.random() * 900)}`,
        issue_date: new Date().toISOString().split("T")[0]
      });
      setSelectedFile(null);
    } catch (err) {
      console.error("TC Save failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-amber-400" /> Transfer Certificate (TC) Portal Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Issue official school Transfer Certificates, upload signed PDFs, and publish for online parent verification.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search TC number, student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue TC Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Issue New Transfer Certificate
          </h3>

          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="TC Number *"
              value={form.tc_number}
              onChange={(e) => setForm({ ...form, tc_number: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 font-mono font-bold"
            />
            <input
              type="text"
              placeholder="Student Full Name *"
              value={form.student_name}
              onChange={(e) => setForm({ ...form, student_name: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Father's Name *"
              value={form.father_name}
              onChange={(e) => setForm({ ...form, father_name: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Class (e.g. Class X)"
                value={form.class}
                onChange={(e) => setForm({ ...form, class: e.target.value })}
                required
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
              <input
                type="text"
                placeholder="Roll / SR No"
                value={form.roll_no}
                onChange={(e) => setForm({ ...form, roll_no: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Upload Signed TC PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-400 file:bg-slate-800 file:text-white file:border-0 file:rounded-lg file:px-2.5 file:py-1 file:mr-2"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? "Uploading & Saving..." : "Issue & Publish TC"}</span>
            </button>
          </div>
        </form>

        {/* Issued TCs Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> Issued Transfer Certificates Directory
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">TC No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Issue Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTcs.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">{tc.tc_number}</td>
                    <td className="py-3 px-3 font-extrabold text-white">{tc.student_name}</td>
                    <td className="py-3 px-3 text-slate-400">{tc.class}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{tc.issue_date}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete TC record for ${tc.student_name}?`)) {
                            onDeleteTC(tc.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-950 rounded-xl border border-slate-800 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
