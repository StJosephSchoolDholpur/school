import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Bus, Shield, MapPin, Clock, Phone, CheckCircle2, Navigation, AlertCircle } from "lucide-react";
import { fetchTransportRoutes, TransportRoute } from "@/lib/db";

const defaultBusStops = [
  { name: "Gulab Bagh", status: "done" },
  { name: "Ondela Road", status: "done" },
  { name: "Police Line", status: "done" },
  { name: "RAC Line", status: "live" },
  { name: "Sadar Thana", status: "upcoming" },
  { name: "Bari Road", status: "upcoming" },
  { name: "Housing Board", status: "destination" },
  { name: "St. Joseph Campus", status: "destination" },
];

const Transportation = () => {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransportRoutes()
      .then((data) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Fetch transport routes error", e);
        setLoading(false);
      });

    const handleSync = () => {
      fetchTransportRoutes().then(setRoutes).catch(console.error);
    };
    window.addEventListener("stjoseph_db_updated", handleSync);
    return () => window.removeEventListener("stjoseph_db_updated", handleSync);
  }, []);

  return (
    <Layout>
      <PageHero
        title="School Transportation"
        subtitle="Safe, GPS-tracked, punctual transport facility covering all major routes in Dholpur"
        breadcrumb="Transportation"
      />

      <section className="py-12 bg-gradient-to-b from-slate-50 via-background to-muted/20">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">

          {/* Top Feature Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bus, title: "Modern Bus Fleet", desc: "15+ Buses with speed governors" },
              { icon: Shield, title: "GPS & CCTV Tracked", desc: "Real-time safety monitoring" },
              { icon: MapPin, title: "Wide Coverage", desc: "20+ pickup & drop routes" },
              { icon: Clock, title: "Punctual Timings", desc: "Strict morning & afternoon schedules" },
            ].map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Interactive Bus Route Tracker Visualizer */}
          <AnimatedSection>
            <div className="bg-gradient-to-br from-primary via-slate-900 to-primary text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary px-3 py-1 bg-white/10 rounded-full border border-white/20">
                    Live Route Overview
                  </span>
                  <h3 className="text-2xl font-heading font-extrabold mt-2">Dholpur City Express Bus Route</h3>
                </div>
                <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                  <Navigation className="w-4 h-4 text-secondary animate-pulse" />
                  <span>Bus No: RJ-11-PA-101 (GPS Connected)</span>
                </div>
              </div>

              {/* Stops Progress Trail */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
                {defaultBusStops.map((stop, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                      stop.status === "live"
                        ? "bg-secondary text-primary-foreground border-secondary ring-4 ring-secondary/30 scale-105"
                        : stop.status === "done"
                        ? "bg-white/10 border-white/20 text-white/90"
                        : "bg-white/5 border-white/10 text-white/50"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                      Stop {idx + 1}
                    </span>
                    <span className="font-bold text-xs line-clamp-1">{stop.name}</span>
                    <span className="text-[9px] mt-2 font-extrabold uppercase">
                      {stop.status === "live" ? "Current Stop" : stop.status === "done" ? "Passed" : "Upcoming"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* DYNAMIC BUS ROUTES TABLE */}
          <AnimatedSection>
            <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden space-y-6">
              <div className="p-6 bg-primary/5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-primary flex items-center gap-2">
                    <Bus className="w-5 h-5 text-secondary" /> Bus Routes & Schedule Timings
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Updated route details managed dynamically by school administration
                  </p>
                </div>
              </div>

              <div className="p-6 overflow-x-auto">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground font-semibold">
                    Loading Bus Routes...
                  </div>
                ) : routes.length === 0 ? (
                  <div className="text-center py-10 space-y-2 text-muted-foreground">
                    <Bus className="w-10 h-10 text-secondary mx-auto" />
                    <p className="font-heading font-bold text-base text-foreground">No Bus Routes Listed</p>
                    <p className="text-xs max-w-sm mx-auto">Active route schedules and bus stop details will appear here once added in the Admin Panel.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-left text-xs uppercase font-bold tracking-wider">
                        <th className="pb-3">Area / Coverage</th>
                        <th className="pb-3">Bus No.</th>
                        <th className="pb-3 hidden md:table-cell">Key Stops</th>
                        <th className="pb-3">Pickup Time</th>
                        <th className="pb-3">Driver Contact</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {routes.map((route) => (
                        <tr key={route.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-4 font-bold text-foreground">
                            {route.area}
                          </td>
                          <td className="py-4 text-xs font-semibold text-primary">
                            <span className="px-2.5 py-1 bg-primary/10 rounded-lg border border-primary/20">
                              {route.busNo}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-muted-foreground hidden md:table-cell max-w-xs truncate">
                            {route.stops}
                          </td>
                          <td className="py-4 font-bold text-secondary text-xs">
                            {route.pickupTime}
                          </td>
                          <td className="py-4 text-xs font-medium text-foreground">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span>{route.driverName || "Driver"}</span>
                              <span className="text-muted-foreground text-[10px]">({route.driverPhone})</span>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Transport Guidelines */}
          <AnimatedSection>
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-sm">
                <h4 className="font-heading font-bold text-foreground text-base">Safety Rules & Parent Guidelines</h4>
                <p className="text-xs text-muted-foreground">
                  Students must reach their respective bus stops 5 minutes prior to scheduled pickup time. Female attendants are present on all junior bus routes.
                </p>
              </div>
              <a
                href="/contact"
                className="btn-primary text-xs px-5 py-2.5 rounded-full whitespace-nowrap shadow-md hover:scale-105 transition-transform"
              >
                Inquire Transport Seat
              </a>
            </div>
          </AnimatedSection>

        </div>
      </section>
    </Layout>
  );
};

export default Transportation;