import React, { useState } from "react";
import { AchievementItem } from "../../lib/db";
import { Trophy, Plus, Trash2 } from "lucide-react";

interface AchievementsModuleProps {
  achievements: AchievementItem[];
  onSaveAchievement: (ach: Omit<AchievementItem, "id"> & { id?: string }) => Promise<void>;
  onDeleteAchievement: (id: string) => Promise<void>;
}

export const AchievementsModule: React.FC<AchievementsModuleProps> = ({
  achievements,
  onSaveAchievement,
  onDeleteAchievement
}) => {
  const [form, setForm] = useState({
    title: "",
    category: "Academic Excellence",
    year: "2026",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    await onSaveAchievement(form);
    setForm({ title: "", category: "Academic Excellence", year: "2026", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" /> School Achievements & Hall of Fame
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Highlight CBSE Board Toppers, District Sports Trophies, and National Olympiad Awards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Add Achievement Record
          </h3>
          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Achievement Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <input
              type="text"
              placeholder="Category (e.g. CBSE Board 100%)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save Record</span>
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 gap-4">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                    {ach.category}
                  </span>
                  <button onClick={() => onDeleteAchievement(ach.id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-heading font-extrabold text-white text-base mt-2">{ach.title}</h3>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                <span>Year: {ach.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
