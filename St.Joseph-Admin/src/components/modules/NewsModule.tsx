import React, { useState } from "react";
import { NewsItem } from "../../lib/db";
import { Newspaper, Plus, Trash2, Calendar } from "lucide-react";

interface NewsModuleProps {
  newsList: NewsItem[];
  onSaveNews: (news: Omit<NewsItem, "id"> & { id?: string }) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
}

export const NewsModule: React.FC<NewsModuleProps> = ({ newsList, onSaveNews, onDeleteNews }) => {
  const [form, setForm] = useState({
    title: "",
    category: "Announcement",
    summary: "",
    content: "",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    await onSaveNews(form);
    setForm({ title: "", category: "Announcement", summary: "", content: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <Newspaper className="w-6 h-6 text-amber-400" /> News & School Announcements
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish school circulars, exam notifications, and news announcements for students and parents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Post New Announcement
          </h3>
          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Headline / Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <input
              type="text"
              placeholder="Short Summary *"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value, content: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish News</span>
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 gap-4">
          {newsList.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <button onClick={() => onDeleteNews(item.id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-heading font-extrabold text-white text-base mt-2">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.summary}</p>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
