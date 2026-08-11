import React, { useState } from "react";
import { MandatoryDoc } from "../../lib/db";
import { ShieldCheck, Plus, Trash2, FileText, ExternalLink } from "lucide-react";

interface MandatoryDocModuleProps {
  mandatoryDocs: MandatoryDoc[];
  onSaveDoc: (doc: Omit<MandatoryDoc, "id"> & { id?: string }) => Promise<void>;
  onDeleteDoc: (id: string) => Promise<void>;
}

export const MandatoryDocModule: React.FC<MandatoryDocModuleProps> = ({
  mandatoryDocs,
  onSaveDoc,
  onDeleteDoc
}) => {
  const [form, setForm] = useState<{
    title: string;
    category: string;
    file_url: string;
    file_type: "pdf" | "link" | "image";
  }>({
    title: "",
    category: "General Information",
    file_url: "",
    file_type: "pdf"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.file_url) return;
    await onSaveDoc({ ...form, is_official_5: true });
    setForm({ title: "", category: "General Information", file_url: "", file_type: "pdf" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" /> Mandatory CBSE Public Disclosure
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage official CBSE Affiliation, Society Registration, NOC, Building Safety & Fire Safety certificates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Add Disclosure Document
          </h3>
          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Document Title (e.g. Building Safety Certificate) *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <input
              type="url"
              placeholder="PDF URL / Link *"
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Publish Document</span>
            </button>
          </div>
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> Published CBSE Public Documents
          </h3>
          <div className="divide-y divide-slate-800/80">
            {mandatoryDocs.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-sm">{doc.title}</h4>
                  <span className="text-xs text-slate-400">{doc.category || "Official Document"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-amber-400 bg-slate-950 hover:bg-amber-500/10 rounded-xl border border-slate-800 flex items-center gap-1 text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </a>
                  <button
                    onClick={() => onDeleteDoc(doc.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
