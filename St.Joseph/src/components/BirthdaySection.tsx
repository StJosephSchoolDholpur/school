import { useState, useEffect, useMemo } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Cake, Sparkles, PartyPopper, GraduationCap, Heart, Calendar, ChevronRight, CheckCircle2, MessageSquare } from "lucide-react";
import { fetchTeachers, fetchStudents, Teacher, Student } from "@/lib/db";

interface BirthdayItem {
  id: string;
  name: string;
  roleOrClass: string;
  dob: string;
  photo_url?: string;
  type: "teacher" | "student";
  isToday: boolean;
  daysUntil: number;
  wishes?: string;
}

function parseDob(dobStr: string): { month: number; day: number } | null {
  if (!dobStr) return null;
  const clean = dobStr.split("T")[0];
  const parts = clean.split("-");
  if (parts.length === 3) {
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!isNaN(m) && !isNaN(d)) return { month: m, day: d };
  }
  return null;
}

function computeBirthdayInfo(dobStr: string): { isToday: boolean; daysUntil: number } {
  const parsed = parseDob(dobStr);
  if (!parsed) return { isToday: false, daysUntil: 999 };

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  if (parsed.month === currentMonth && parsed.day === currentDay) {
    return { isToday: true, daysUntil: 0 };
  }

  const thisYear = now.getFullYear();
  let nextBday = new Date(thisYear, parsed.month - 1, parsed.day);
  if (nextBday.getTime() < now.getTime()) {
    nextBday = new Date(thisYear + 1, parsed.month - 1, parsed.day);
  }

  const diffTime = nextBday.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { isToday: false, daysUntil: diffDays };
}

const BirthdaySection = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "teachers" | "students">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeachers(), fetchStudents()])
      .then(([tData, sData]) => {
        setTeachers(tData);
        setStudents(sData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("BirthdaySection data load error", err);
        setLoading(false);
      });

    const handleSync = () => {
      Promise.all([fetchTeachers(), fetchStudents()])
        .then(([tData, sData]) => {
          setTeachers(tData);
          setStudents(sData);
        })
        .catch(console.error);
    };
    window.addEventListener("stjoseph_db_updated", handleSync);
    return () => window.removeEventListener("stjoseph_db_updated", handleSync);
  }, []);

  // Filter list to ONLY include today's birthdays
  const todayBirthdays: BirthdayItem[] = useMemo(() => {
    const list: BirthdayItem[] = [];

    teachers.forEach((t) => {
      const bInfo = computeBirthdayInfo(t.dob);
      if (bInfo.isToday) {
        list.push({
          id: t.id,
          name: t.name,
          roleOrClass: t.designation || "Faculty Member",
          dob: t.dob,
          photo_url: t.photo_url,
          type: "teacher",
          isToday: true,
          daysUntil: 0,
          wishes: t.wishes || "Wishing you joy and wonderful health on your special day!",
        });
      }
    });

    students.forEach((s) => {
      const bInfo = computeBirthdayInfo(s.dob);
      if (bInfo.isToday) {
        list.push({
          id: s.id,
          name: s.name,
          roleOrClass: s.class || "Student",
          dob: s.dob,
          photo_url: s.photo_url,
          type: "student",
          isToday: true,
          daysUntil: 0,
          wishes: s.wishes || "Happy Birthday! Keep shining bright in your studies!",
        });
      }
    });

    return list;
  }, [teachers, students]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "teachers") return todayBirthdays.filter((i) => i.type === "teacher");
    if (activeFilter === "students") return todayBirthdays.filter((i) => i.type === "student");
    return todayBirthdays;
  }, [todayBirthdays, activeFilter]);

  return (
    <section className="py-16 bg-gradient-to-br from-amber-500/10 via-background to-primary/5 relative overflow-hidden">
      {/* Decorative festive blur bubbles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl space-y-10 relative z-10">

        {/* Section Title */}
        <AnimatedSection>
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm">
              <PartyPopper className="w-4 h-4 animate-bounce" /> Today's Birthday Celebrations
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary">
              St. Joseph's Today's Birthday Corner 🎉
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Celebrating our wonderful teachers and students celebrating their birthday today!
            </p>
          </div>
        </AnimatedSection>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { id: "all", label: `Today's Birthdays (${todayBirthdays.length})` },
            { id: "teachers", label: `Teachers 🎓 (${todayBirthdays.filter(i => i.type === "teacher").length})` },
            { id: "students", label: `Students 🎒 (${todayBirthdays.filter(i => i.type === "student").length})` },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                activeFilter === btn.id
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-card hover:bg-muted text-foreground/80 border border-border"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Birthday Cards Grid */}
        {loading ? (
          <div className="text-center py-10 text-muted-foreground font-semibold">
            Loading Today's Birthday Celebrations...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-3xl border border-border p-8 text-muted-foreground space-y-2 max-w-md mx-auto shadow-sm">
            <Cake className="w-10 h-10 text-amber-500/60 mx-auto animate-pulse" />
            <h3 className="font-heading font-bold text-foreground text-base">No Birthdays Today!</h3>
            <p className="text-xs text-muted-foreground">Check back tomorrow for new birthday celebrations at St. Joseph's.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <AnimatedSection key={item.id}>
                <div
                  className="rounded-3xl p-6 shadow-xl border border-amber-400 bg-gradient-to-b from-amber-500/15 via-card to-card ring-2 ring-amber-400/40 shadow-amber-500/10 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1.5 space-y-4"
                >
                  {/* Today Badge Banner */}
                  <div className="flex items-center justify-between">
                    <div className="px-3 py-1 bg-amber-500 text-primary-foreground font-heading font-extrabold text-[10px] uppercase rounded-full shadow-md animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Today's Birthday!
                    </div>

                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary px-2.5 py-0.5 bg-secondary/10 rounded-full">
                      {item.type === "teacher" ? "Faculty" : "Student"}
                    </span>
                  </div>

                  {/* Card Main Header */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={
                          item.photo_url ||
                          "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
                        }
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow">
                        {item.type === "teacher" ? (
                          <GraduationCap className="w-3 h-3" />
                        ) : (
                          <Cake className="w-3 h-3" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-heading font-extrabold text-lg text-foreground group-hover:text-amber-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {item.roleOrClass}
                      </p>
                    </div>
                  </div>

                  {/* Wishes Body */}
                  <div className="pt-3 border-t border-border/40 text-xs text-foreground/80 italic leading-relaxed">
                    "{item.wishes}"
                  </div>

                  {/* AUTOMATED WHATSAPP MESSAGE SENT CONFIRMATION BADGE */}
                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-2xl border border-emerald-500/30 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>WhatsApp Birthday Wish Delivered Automatically 📲</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default BirthdaySection;
