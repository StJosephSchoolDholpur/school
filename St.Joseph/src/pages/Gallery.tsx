import { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Image as ImageIcon, ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";
import { fetchEvents, EventItem } from "@/lib/db";
import { supabase, SUPABASE_ANON_KEY } from "@/lib/supabase";

interface GalleryPhoto {
  id: string;
  title: string;
  category?: string;
  image_url?: string;
  src?: string;
}

const mainCategories = ["All", "Events", "Campus", "Sports", "Classroom", "Staff"];

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryPhoto[]>([]);
  const [dbEvents, setDbEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [eventSubFilter, setEventSubFilter] = useState("All Events");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (SUPABASE_ANON_KEY) {
        try {
          const [gRes, eData] = await Promise.all([
            supabase.from("gallery").select("*").order("created_at", { ascending: false }),
            fetchEvents()
          ]);
          if (!gRes.error && gRes.data) {
            setGalleryItems(gRes.data);
          }
          if (eData) {
            setDbEvents(eData);
          }
          setLoading(false);
          return;
        } catch (e) {}
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Strictly filter gallery photos whose category is Events / Celebration / Competition
  const eventPhotos = useMemo(() => {
    return galleryItems.filter((g) => {
      const cat = (g.category || "").toLowerCase();
      return cat.includes("event") || cat.includes("celebration") || cat.includes("competition");
    });
  }, [galleryItems]);

  // Dynamically generate Event Subtabs STRICTLY for Events category!
  const dynamicEventSubtabs = useMemo(() => {
    const set = new Set<string>();
    set.add("All Events");

    const candidateTitles: string[] = [];

    // 1. Add titles from events database table
    dbEvents.forEach((ev) => {
      if (ev.title) candidateTitles.push(ev.title);
    });

    // 2. ONLY add titles from gallery items whose category IS Event / Celebration / Competition
    eventPhotos.forEach((g) => {
      if (g.title) candidateTitles.push(g.title);
    });

    candidateTitles.forEach((rawTitle) => {
      // Clean title: remove numbers like 2026, #1, and sub-dash details
      const cleaned = rawTitle
        .replace(/\s*#\d+$/, "")
        .replace(/\s*\d{4}/, "")
        .replace(/\s*-\s*.*$/, "")
        .trim();

      if (cleaned.length > 3) {
        const subQ = cleaned.toLowerCase();
        // Check if AT LEAST 1 event photo matches this cleaned title
        const hasMatchingPhoto = eventPhotos.some((g) => {
          const cat = (g.category || "").toLowerCase();
          const title = (g.title || "").toLowerCase();
          return title.includes(subQ) || cat.includes(subQ);
        });

        if (hasMatchingPhoto) {
          set.add(cleaned);
        }
      }
    });

    return Array.from(set);
  }, [dbEvents, eventPhotos]);

  // Filtered photos based on Main Filter & Dynamic Event Subtabs
  const filtered = useMemo(() => {
    if (activeFilter === "All") return galleryItems;

    if (activeFilter === "Events") {
      if (eventSubFilter === "All Events") return eventPhotos;

      const subQ = eventSubFilter.toLowerCase().trim();
      return eventPhotos.filter((g) => {
        const cat = (g.category || "").toLowerCase();
        const title = (g.title || "").toLowerCase();
        
        if (title.includes(subQ) || cat.includes(subQ)) return true;
        const words = subQ.split(" ").filter((w) => w.length > 3);
        return words.some((w) => title.includes(w) || cat.includes(w));
      });
    }

    // Standard Category Filtering (Campus, Sports, Classroom, Staff, etc.)
    const catQ = activeFilter.toLowerCase();
    return galleryItems.filter((g) => {
      const cat = (g.category || "").toLowerCase();
      const title = (g.title || "").toLowerCase();
      return cat.includes(catQ) || title.includes(catQ);
    });
  }, [galleryItems, eventPhotos, activeFilter, eventSubFilter]);

  const currentIndex = lightbox !== null ? filtered.findIndex((g) => g.id === lightbox) : -1;

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setLightbox(filtered[currentIndex - 1].id);
  }, [currentIndex, filtered]);

  const goNext = useCallback(() => {
    if (currentIndex < filtered.length - 1) setLightbox(filtered[currentIndex + 1].id);
  }, [currentIndex, filtered]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, goPrev, goNext]);

  const currentItem = currentIndex >= 0 ? filtered[currentIndex] : null;

  return (
    <Layout>
      <PageHero
        title="Photo Gallery"
        subtitle="Moments and memories from St. Joseph's International School"
        breadcrumb="Gallery"
      />

      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-7xl space-y-8">
          
          {/* Main Category Filter Pills */}
          <AnimatedSection>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {mainCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveFilter(cat);
                      if (cat === "Events") setEventSubFilter("All Events");
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all shadow-sm ${
                      activeFilter === cat
                        ? "bg-primary text-primary-foreground shadow-md scale-105 ring-2 ring-primary/30"
                        : "bg-card hover:bg-muted text-foreground/80 border border-border/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* DYNAMIC EVENT SUBTABS (Deduplicated & ONLY shows events with existing photos!) */}
              {activeFilter === "Events" && dynamicEventSubtabs.length > 1 && (
                <div className="w-full bg-amber-500/10 border border-amber-500/20 p-4 rounded-3xl animate-fade-in space-y-2 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <Calendar className="w-4 h-4" /> Filter by Specific Event ({dynamicEventSubtabs.length - 1} Events with Photos):
                  </div>
                  <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                    {dynamicEventSubtabs.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setEventSubFilter(sub)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                          eventSubFilter === sub
                            ? "bg-amber-500 text-slate-950 shadow-md scale-105 font-extrabold"
                            : "bg-card text-foreground/80 hover:bg-amber-500/20 border border-border/60"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground font-semibold">
              Loading Photo Gallery...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3 shadow-md max-w-xl mx-auto">
              <ImageIcon className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="text-xl font-heading font-extrabold text-primary">No Photos Found</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No photos matched the category "{activeFilter}"{activeFilter === "Events" ? ` -> "${eventSubFilter}"` : ""}. Upload photos in the Admin Panel to display them here.
              </p>
            </div>
          ) : (
            /* MASONRY BENTO GRID LAYOUT */
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setLightbox(item.id)}
                  className="break-inside-avoid group relative bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={item.image_url || item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                      {item.category || "Campus"}
                    </span>
                    <h4 className="font-heading font-bold text-sm leading-snug">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {currentItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {currentIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < filtered.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center space-y-3">
            <img
              src={currentItem.image_url || currentItem.src}
              alt={currentItem.title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center text-white space-y-1">
              <h3 className="font-heading font-bold text-lg">{currentItem.title}</h3>
              <p className="text-xs text-amber-400 font-semibold">{currentItem.category || "Campus"}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;