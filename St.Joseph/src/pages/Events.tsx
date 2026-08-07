import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  ListChecks,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
  Sparkles,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  X,
  ZoomIn,
  RotateCcw
} from "lucide-react";
import { fetchEvents, EventItem } from "@/lib/db";

export interface FormattedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: string;
  shortDesc: string;
  fullDesc: string;
  chiefGuest?: string;
  targetAudience: string;
  agenda: string[];
  guidelines: string[];
  badgeColor: string;
  photos: { src: string; caption: string }[];
}

const categories = ["All", "Sports", "Academic", "Cultural", "Celebration", "Competitions"] as const;

const Events = () => {
  const [activeStatus, setActiveStatus] = useState<"All" | "Upcoming" | "Recent">("All");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [eventsList, setEventsList] = useState<FormattedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEventIds, setExpandedEventIds] = useState<Record<string, boolean>>({});
  const [modalPhoto, setModalPhoto] = useState<{ src: string; caption: string } | null>(null);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        const formatted: FormattedEvent[] = data.map((item, idx) => ({
          id: item.id || `evt-${idx}`,
          title: item.title,
          date: item.date,
          time: item.time || "09:00 AM - 01:00 PM",
          location: item.location || "School Grounds",
          category: item.category || "Celebration",
          status: item.status || "Upcoming",
          shortDesc: item.shortDesc || item.description || "Official St. Joseph School Event",
          fullDesc: item.fullDesc || item.description || item.shortDesc || "Detailed event agenda and schedule guidelines.",
          chiefGuest: item.chiefGuest || "",
          targetAudience: item.targetAudience || "Students, Staff & Parents",
          agenda: Array.isArray(item.agenda)
            ? item.agenda
            : typeof item.agenda === "string"
            ? item.agenda.split("\n").filter(Boolean)
            : ["09:00 AM - Event Inauguration", "12:30 PM - Event Wrap up"],
          guidelines: Array.isArray(item.guidelines)
            ? item.guidelines
            : typeof item.guidelines === "string"
            ? item.guidelines.split("\n").filter(Boolean)
            : ["Students must report in full school uniform."],
          badgeColor: item.badgeColor || "bg-blue-600 text-white",
          photos: Array.isArray(item.photos)
            ? item.photos.map((p: any) => typeof p === "string" ? { src: p, caption: item.title } : p)
            : item.image_url
            ? [{ src: item.image_url, caption: item.title }]
            : []
        }));
        // Sort newest / latest events first at the top
        formatted.sort((a, b) => {
          const tA = new Date(a.date).getTime();
          const tB = new Date(b.date).getTime();
          if (!isNaN(tA) && !isNaN(tB)) return tB - tA;
          return 0;
        });

        setEventsList(formatted);
        if (formatted.length > 0) {
          setExpandedEventIds({ [formatted[0].id]: true });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading events from database", err);
        setLoading(false);
      });
  }, []);

  // Filtered Events List
  const filteredEvents = useMemo(() => {
    return eventsList.filter((ev) => {
      const matchesStatus = activeStatus === "All" || ev.status === activeStatus;
      const matchesCategory = activeCategory === "All" || ev.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [eventsList, activeStatus, activeCategory, searchQuery]);

  // Toggle individual accordion dropdown
  const toggleAccordion = (id: string) => {
    setExpandedEventIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expand All / Collapse All controls
  const isAllExpanded = useMemo(() => {
    if (filteredEvents.length === 0) return false;
    return filteredEvents.every((ev) => expandedEventIds[ev.id]);
  }, [filteredEvents, expandedEventIds]);

  const toggleExpandAll = () => {
    const nextState: Record<string, boolean> = {};
    const shouldExpand = !isAllExpanded;
    filteredEvents.forEach((ev) => {
      nextState[ev.id] = shouldExpand;
    });
    setExpandedEventIds((prev) => ({ ...prev, ...nextState }));
  };

  return (
    <Layout>
      <PageHero
        title="School Events & Programs"
        subtitle="Dynamic list of academic competitions, annual celebrations, sports days, and cultural activities"
        breadcrumb="Events"
      />

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Controls Bar: Search, Status Tabs, Category Filter & Expand All */}
          <AnimatedSection>
            <div className="bg-card border border-border/80 rounded-2xl p-4 md:p-6 shadow-sm mb-10 space-y-5">
              
              {/* Top Row: Search Input + Status Tabs */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Status Segment Control (All / Upcoming / Recent) */}
                <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60 w-full md:w-auto">
                  {(["All", "Upcoming", "Recent"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setActiveStatus(st)}
                      className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeStatus === st
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {st === "All" ? "All Events" : `${st} Events`}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events or topics..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Category Filter Pills & Expand All Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline">Category:</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        activeCategory === cat
                          ? "bg-secondary text-secondary-foreground shadow-sm"
                          : "bg-background text-muted-foreground border border-border/60 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Bulk Accordion Expand / Collapse Button */}
                <button
                  onClick={toggleExpandAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition-all ml-auto"
                >
                  {isAllExpanded ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-primary" />
                      <span>Collapse All</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-primary" />
                      <span>Expand All Dropdowns</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground font-semibold">
              Loading School Events from Database...
            </div>
          ) : eventsList.length === 0 ? (
            <AnimatedSection>
              <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3 shadow-md max-w-xl mx-auto">
                <Calendar className="w-12 h-12 text-secondary mx-auto" />
                <h3 className="text-xl font-heading font-extrabold text-primary">No Events Scheduled</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  No school events were found in the database. Add events in the Admin Panel to publish them here dynamically.
                </p>
              </div>
            </AnimatedSection>
          ) : filteredEvents.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-16 px-4 bg-card border border-border/60 rounded-2xl">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">No Matching Events</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  No events matched your search query "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setActiveStatus("All");
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Event Filters
                </button>
              </div>
            </AnimatedSection>
          ) : (
            /* EVENTS COLLAPSIBLE ACCORDION LIST */
            <div className="space-y-5">
              {filteredEvents.map((event, i) => {
                const isExpanded = Boolean(expandedEventIds[event.id]);

                return (
                  <AnimatedSection key={event.id} delay={Math.min(i * 0.05, 0.3)}>
                    <div
                      className={`bg-card rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
                        isExpanded ? "border-primary/40 ring-1 ring-primary/20" : "border-border/80"
                      }`}
                    >
                      {/* ACCORDION HEADER BAR (Always Visible & Clickable) */}
                      <div
                        onClick={() => toggleAccordion(event.id)}
                        className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          {/* Date Box */}
                          <div
                            className={`px-4 py-3 rounded-xl ${event.badgeColor || "bg-primary text-white"} flex flex-col items-center justify-center text-center shrink-0 min-w-[110px] shadow-sm`}
                          >
                            <Calendar className="w-4 h-4 mb-1 opacity-90" />
                            <span className="font-heading font-extrabold text-xs leading-tight whitespace-nowrap">
                              {event.date}
                            </span>
                          </div>

                          {/* Event Title & Summary */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wide">
                                {event.category}
                              </span>
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  event.status === "Upcoming"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                {event.status}
                              </span>
                            </div>

                            <h3 className="font-heading font-bold text-base md:text-lg text-foreground hover:text-primary transition-colors">
                              {event.title}
                            </h3>

                            <p className="text-xs text-muted-foreground flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-primary/70" /> {event.location}
                              </span>
                              <span className="hidden sm:flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-primary/70" /> {event.time}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Expand/Collapse Dropdown Arrow & Label */}
                        <div className="flex items-center gap-2 text-primary font-semibold text-xs shrink-0 self-end md:self-center bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">
                          <span>{isExpanded ? "Hide Details" : "View Details & Photos"}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 transition-transform duration-300" />
                          ) : (
                            <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                          )}
                        </div>
                      </div>

                      {/* EXPANDABLE ACCORDION DROPDOWN CONTENT */}
                      {isExpanded && (
                        <div className="px-5 pb-6 md:px-6 md:pb-6 pt-2 border-t border-border/60 bg-muted/20 animate-fade-in space-y-6">
                          
                          {/* Event Full Description */}
                          <div>
                            <p className="text-sm text-foreground/90 leading-relaxed font-normal">
                              {event.fullDesc}
                            </p>
                          </div>

                          {/* Info Grid (Guest, Target Audience, Timing) */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-card p-3.5 rounded-xl border border-border/60 flex items-start gap-3">
                              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase">Timings</p>
                                <p className="text-xs font-semibold text-foreground mt-0.5">{event.time}</p>
                              </div>
                            </div>

                            {event.chiefGuest && (
                              <div className="bg-card p-3.5 rounded-xl border border-border/60 flex items-start gap-3">
                                <UserCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[11px] font-bold text-muted-foreground uppercase">Guest of Honor</p>
                                  <p className="text-xs font-semibold text-foreground mt-0.5">{event.chiefGuest}</p>
                                </div>
                              </div>
                            )}

                            <div className="bg-card p-3.5 rounded-xl border border-border/60 flex items-start gap-3">
                              <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase">Target Audience</p>
                                <p className="text-xs font-semibold text-foreground mt-0.5">{event.targetAudience}</p>
                              </div>
                            </div>
                          </div>

                          {/* Event Agenda & Instructions Breakdown */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Agenda Dropdown Section */}
                            {event.agenda && event.agenda.length > 0 && (
                              <div className="bg-card p-4 rounded-xl border border-border/70 space-y-3">
                                <div className="flex items-center gap-2 text-primary font-heading font-bold text-xs uppercase tracking-wide">
                                  <ListChecks className="w-4 h-4" />
                                  <span>Event Agenda & Timeline</span>
                                </div>
                                <ul className="space-y-2">
                                  {event.agenda.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Important Guidelines Dropdown Section */}
                            {event.guidelines && event.guidelines.length > 0 && (
                              <div className="bg-card p-4 rounded-xl border border-border/70 space-y-3">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-heading font-bold text-xs uppercase tracking-wide">
                                  <FileText className="w-4 h-4" />
                                  <span>Important Instructions</span>
                                </div>
                                <ul className="space-y-2">
                                  {event.guidelines.map((guide, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                      <span>{guide}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Event Photo Gallery Grid inside Dropdown */}
                          {event.photos && event.photos.length > 0 && (
                            <div className="bg-card p-4 rounded-xl border border-border/70 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-secondary font-heading font-bold text-xs uppercase tracking-wide">
                                  <ImageIcon className="w-4 h-4" />
                                  <span>Event Highlights Photo Gallery</span>
                                </div>
                                <span className="text-[11px] text-muted-foreground font-medium">
                                  {event.photos.length} Photos
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                                {event.photos.map((p, pIdx) => (
                                  <div
                                    key={pIdx}
                                    onClick={() => setModalPhoto(p)}
                                    className="relative aspect-4/3 rounded-xl overflow-hidden group cursor-zoom-in border border-border/60 bg-muted shadow-sm hover:shadow-md transition-all"
                                  >
                                    <img
                                      src={p.src}
                                      alt={p.caption}
                                      loading="lazy"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                                      <ZoomIn className="w-5 h-5 text-white" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}

          {/* Bottom Footer Note */}
          <div className="mt-12 text-center text-xs text-muted-foreground bg-card border border-border/60 rounded-xl p-4">
            <p className="flex items-center justify-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-secondary" />
              For queries regarding event participation or schedule changes, please contact the school administration office.
            </p>
          </div>

        </div>
      </section>

      {/* Single Photo Lightbox Modal */}
      {modalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setModalPhoto(null)}
        >
          <button
            onClick={() => setModalPhoto(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-3xl max-h-[85vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalPhoto.src}
              alt={modalPhoto.caption}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <p className="text-white font-medium text-sm text-center px-4">{modalPhoto.caption}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Events;