import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Calendar as CalendarIcon, CheckCircle2, Clock, Sparkles, Filter, AlertCircle, PartyPopper } from "lucide-react";
import { supabase, SUPABASE_ANON_KEY } from "@/lib/supabase";

interface CalendarEventItem {
  id: string;
  title: string;
  date: string;
  category?: string;
  description?: string;
  month?: string;
}

const SchoolCalendar = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"All" | "Upcoming" | "Past">("Upcoming");

  useEffect(() => {
    async function loadCalendar() {
      if (SUPABASE_ANON_KEY) {
        try {
          const { data, error } = await supabase.from("calendar").select("*").order("date", { ascending: true });
          if (!error && data) {
            setCalendarEvents(data);
            setLoading(false);
            return;
          }
        } catch (e) { }
      }
      setCalendarEvents([]);
      setLoading(false);
    }
    loadCalendar();
  }, []);

  // Helper to determine Past, Today, or Upcoming status
  const getEventTimingStatus = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(dateStr);
    if (isNaN(eventDate.getTime())) {
      return {
        status: "Upcoming",
        daysDiff: 0,
        badgeText: "Scheduled",
        badgeColor: "bg-blue-600 text-white font-bold",
        cardStyle: "border border-border bg-card hover:border-primary/40 shadow-sm"
      };
    }

    eventDate.setHours(0, 0, 0, 0);
    const timeDiff = eventDate.getTime() - today.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
      return {
        status: "Today",
        daysDiff: 0,
        badgeText: "🎉 TODAY'S HOLIDAY / FESTIVAL",
        badgeColor: "bg-amber-500 text-slate-950 font-extrabold animate-pulse shadow-md",
        cardStyle: "border-2 border-amber-500 ring-4 ring-amber-500/20 bg-amber-500/10 shadow-xl scale-[1.02]"
      };
    }

    if (daysDiff > 0) {
      return {
        status: "Upcoming",
        daysDiff,
        badgeText: daysDiff === 1 ? "Tomorrow" : `In ${daysDiff} Days`,
        badgeColor: "bg-emerald-600 text-white font-bold",
        cardStyle: "border border-border bg-card hover:border-primary/40 shadow-sm hover:shadow-md"
      };
    }

    return {
      status: "Past",
      daysDiff,
      badgeText: "Concluded",
      badgeColor: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium",
      cardStyle: "border border-border/60 bg-card/60 opacity-80 hover:opacity-100"
    };
  };

  // Sort calendar events chronologically by date
  const sortedCalendarEvents = useMemo(() => {
    return [...calendarEvents].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (!isNaN(timeA) && !isNaN(timeB)) return timeA - timeB;
      return a.date.localeCompare(b.date);
    });
  }, [calendarEvents]);

  // Filtered by Past / Today / Upcoming
  const filteredEvents = useMemo(() => {
    if (statusFilter === "All") return sortedCalendarEvents;
    return sortedCalendarEvents.filter((item) => {
      const timing = getEventTimingStatus(item.date);
      if (statusFilter === "Upcoming") return timing.status === "Upcoming" || timing.status === "Today";
      if (statusFilter === "Past") return timing.status === "Past";
      return true;
    });
  }, [sortedCalendarEvents, statusFilter]);

  // Check if today has a holiday
  const todayEvent = useMemo(() => {
    return sortedCalendarEvents.find((ev) => getEventTimingStatus(ev.date).status === "Today");
  }, [sortedCalendarEvents]);

  return (
    <Layout>
      <PageHero title="School Calendar 2026" subtitle="Academic year activity and holiday schedule" breadcrumb="Calendar" />
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-5xl space-y-8">

          {/* Today's Special Holiday Banner (If Today is a Holiday!) */}
          {todayEvent && (
            <AnimatedSection>
              <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-amber-300 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-950/10 rounded-2xl flex items-center justify-center shrink-0">
                    <PartyPopper className="w-7 h-7 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-950 text-amber-400 px-3 py-0.5 rounded-full">
                      Today's School Holiday
                    </span>
                    <h3 className="text-xl md:text-2xl font-heading font-extrabold mt-1">
                      {todayEvent.title}
                    </h3>
                    <p className="text-xs font-semibold opacity-90">{todayEvent.date} — {todayEvent.description}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Filter Bar: Segment Control (All / Upcoming & Today / Concluded Past) */}
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Filter className="w-4 h-4 text-primary" /> Filter Holidays & Festivals:
              </div>

              <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60 w-full sm:w-auto">
                {(["All", "Upcoming", "Past"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${statusFilter === st
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {st === "All" ? "All (2026)" : st === "Upcoming" ? "Upcoming & Today" : "Concluded (Past)"}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground font-semibold">
              Loading Academic Calendar...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3 shadow-md max-w-xl mx-auto">
              <CalendarIcon className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="text-xl font-heading font-extrabold text-primary">No Events Found</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No calendar entries matched the filter "{statusFilter}".
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredEvents.map((item, i) => {
                const timing = getEventTimingStatus(item.date);

                return (
                  <AnimatedSection key={item.id || i} delay={Math.min(i * 0.05, 0.3)}>
                    <div className={`rounded-2xl p-6 transition-all duration-300 space-y-3 ${timing.cardStyle}`}>

                      {/* Top Header Row: Category Badge + Timing Badge */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full">
                          {item.category || "Holiday"}
                        </span>

                        <span className={`text-[11px] px-3 py-0.5 rounded-full shadow-sm ${timing.badgeColor}`}>
                          {timing.badgeText}
                        </span>
                      </div>

                      {/* Title & Date */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-secondary" />
                          <span>{item.date}</span>
                        </div>
                        <h3 className="font-heading font-bold text-base md:text-lg text-foreground leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
                          {item.description}
                        </p>
                      )}

                      {/* Timing Indicator Footer */}
                      <div className="pt-2 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                        {timing.status === "Past" ? (
                          <span className="flex items-center gap-1 text-slate-500">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Event Concluded
                          </span>
                        ) : timing.status === "Today" ? (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                            <Sparkles className="w-3.5 h-3.5" /> Active Today
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            {/* <Clock className="w-3.5 h-3.5" /> Upcoming Festival */}
                          </span>
                        )}
                      </div>

                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SchoolCalendar;