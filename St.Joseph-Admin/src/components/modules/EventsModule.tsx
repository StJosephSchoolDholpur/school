import React, { useState } from "react";
import { EventItem } from "../../lib/db";
import { Calendar, Plus, Trash2, MapPin, Clock } from "lucide-react";

interface EventsModuleProps {
  events: EventItem[];
  onSaveEvent: (evt: Omit<EventItem, "id"> & { id?: string }) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

export const EventsModule: React.FC<EventsModuleProps> = ({ events, onSaveEvent, onDeleteEvent }) => {
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00 AM",
    location: "School Auditorium",
    category: "Celebration",
    shortDesc: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    await onSaveEvent({ ...form, status: "Upcoming" });
    setForm({ title: "", date: new Date().toISOString().split("T")[0], time: "09:00 AM", location: "School Auditorium", category: "Celebration", shortDesc: "" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-amber-400" /> School Events & Celebrations Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage upcoming Annual Function, Sports Meet, Science Exhibition, and Cultural Competitions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Create School Event
          </h3>
          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Event Title *"
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
            <input
              type="text"
              placeholder="Location (e.g. Auditorium)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 gap-4">
          {events.map((evt) => (
            <div key={evt.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                    {evt.category || "Event"}
                  </span>
                  <button onClick={() => onDeleteEvent(evt.id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-heading font-extrabold text-white text-base mt-2">{evt.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{evt.location}</span>
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="text-amber-400 font-bold">📅 {evt.date}</span>
                <span>⏰ {evt.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
