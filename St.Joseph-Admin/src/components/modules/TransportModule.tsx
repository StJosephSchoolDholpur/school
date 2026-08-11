import React, { useState } from "react";
import { TransportRoute } from "../../lib/db";
import { Bus, Plus, Trash2, Phone, Clock, MapPin, IndianRupee } from "lucide-react";

interface TransportModuleProps {
  routes: TransportRoute[];
  onSaveRoute: (route: Omit<TransportRoute, "id"> & { id?: string }) => Promise<void>;
  onDeleteRoute: (id: string) => Promise<void>;
}

export const TransportModule: React.FC<TransportModuleProps> = ({ routes, onSaveRoute, onDeleteRoute }) => {
  const [form, setForm] = useState<{
    area: string;
    busNo: string;
    stops: string;
    pickupTime: string;
    dropTime: string;
    driverName: string;
    driverPhone: string;
    monthlyFee: string;
    status: "live" | "done" | "upcoming" | "active";
  }>({
    area: "",
    busNo: "",
    stops: "",
    pickupTime: "07:00 AM",
    dropTime: "02:15 PM",
    driverName: "",
    driverPhone: "",
    monthlyFee: "1,200",
    status: "live"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.area || !form.busNo) return;

    setIsSubmitting(true);
    try {
      await onSaveRoute(form);
      setForm({
        area: "",
        busNo: "",
        stops: "",
        pickupTime: "07:00 AM",
        dropTime: "02:15 PM",
        driverName: "",
        driverPhone: "",
        monthlyFee: "1,200",
        status: "live"
      });
    } catch (err) {
      console.error("Save route failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <Bus className="w-6 h-6 text-amber-400" /> Transportation Routes & Bus Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage school buses, driver contact numbers, route stops, and monthly transport fees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Add New Bus Route
          </h3>

          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Route / Area Name *"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Bus Vehicle No. (e.g. RJ-11-PA-101) *"
              value={form.busNo}
              onChange={(e) => setForm({ ...form, busNo: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Stops (Comma separated)"
              value={form.stops}
              onChange={(e) => setForm({ ...form, stops: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Driver Name"
                value={form.driverName}
                onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
              <input
                type="tel"
                placeholder="Driver Phone"
                value={form.driverPhone}
                onChange={(e) => setForm({ ...form, driverPhone: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Bus className="w-4 h-4" />
              <span>{isSubmitting ? "Saving Route..." : "Save Transport Route"}</span>
            </button>
          </div>
        </form>

        {/* Bus Routes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 gap-4">
          {routes.map((route) => (
            <div key={route.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    🚌 {route.busNo}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete transport route ${route.area}?`)) {
                        onDeleteRoute(route.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-heading font-extrabold text-base text-white mt-2">{route.area}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Stops: {route.stops}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Driver: <strong className="text-white">{route.driverName || "N/A"}</strong></span>
                  <span className="text-emerald-400 font-mono">📱 {route.driverPhone || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Timings: <strong className="text-slate-200">{route.pickupTime} - {route.dropTime}</strong></span>
                  <span className="text-amber-400 font-bold font-mono">₹{route.monthlyFee}/mo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
