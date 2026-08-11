import React, { useState } from "react";
import { CalendarEvent } from "../../lib/db";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";

interface CalendarModuleProps {
  events: CalendarEvent[];
  onSaveEvent: (evt: Omit<CalendarEvent, "id"> & { id?: string }) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({ events, onSaveEvent, onDeleteEvent }) => {
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    category: "Academic",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    await onSaveEvent(form);
    setForm({ title: "", date: new Date().toISOString().split("T")[0], category: "Academic", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-amber-400" /> Academic Calendar & Holidays Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure school session start dates, examination schedules, national holidays, and vacations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Add Calendar Entry
          </h3>
          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Title (e.g. Independence Day) *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Entry</span>
            </button>
          </div>
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <div className="divide-y divide-slate-800/80">
            {events.map((evt) => (
              <div key={evt.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-sm">{evt.title}</h4>
                  <span className="text-xs text-amber-400 font-mono">{evt.date}</span>
                </div>
                <button onClick={() => onDeleteEvent(evt.id)} className="text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
