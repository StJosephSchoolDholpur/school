import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Trophy, Medal, Star, Award } from "lucide-react";
import { supabase, SUPABASE_ANON_KEY } from "@/lib/supabase";

interface Achievement {
  id: string;
  title: string;
  category?: string;
  year?: string;
  desc?: string;
  description?: string;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      if (SUPABASE_ANON_KEY) {
        try {
          const { data, error } = await supabase
            .from("achievements")
            .select("*")
            .order("created_at", { ascending: false });
          if (!error && data) {
            setAchievements(data);
            setLoading(false);
            return;
          }
        } catch (e) {}
      }
      setAchievements([]);
      setLoading(false);
    }
    loadAchievements();
  }, []);

  return (
    <Layout>
      <PageHero title="Achievements" subtitle="Celebrating excellence across all domains" breadcrumb="Achievements" />
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground font-semibold">
              Loading Achievements...
            </div>
          ) : achievements.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3 shadow-md">
              <Trophy className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="text-xl font-heading font-extrabold text-primary">No Achievements Listed</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No achievement records were found in the database. New awards and honors will appear here once published by school administration.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((a, i) => (
                <AnimatedSection key={a.id || i} delay={i * 0.08}>
                  <div className="bg-card rounded-xl border border-border p-6 card-hover h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-secondary" />
                        </div>
                        {a.year && (
                          <span className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                            {a.year}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-foreground mb-2 text-base">{a.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{a.description || a.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Achievements;