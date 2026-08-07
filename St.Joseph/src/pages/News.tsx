import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Newspaper } from "lucide-react";
import { supabase, SUPABASE_ANON_KEY } from "@/lib/supabase";

interface NewsArticle {
  id: string;
  title: string;
  date?: string;
  category?: string;
  summary?: string;
  content?: string;
  desc?: string;
  created_at?: string;
}

const News = () => {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      if (SUPABASE_ANON_KEY) {
        try {
          const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
          if (!error && data) {
            setNewsList(data);
            setLoading(false);
            return;
          }
        } catch (e) { }
      }
      setNewsList([]);
      setLoading(false);
    }
    loadNews();
  }, []);

  return (
    <Layout>
      <PageHero title="Latest News & Updates" subtitle="Latest announcements and press releases from St. Joseph's" breadcrumb="News" />
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground font-semibold">
              Loading News Articles...
            </div>
          ) : newsList.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3 shadow-md">
              <Newspaper className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="text-xl font-heading font-extrabold text-primary">No News Bulletins Published</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No active news articles were found in the database. Official school announcements will appear here once published.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((n, i) => (
                <AnimatedSection key={n.id || i} delay={i * 0.08}>
                  <div className="bg-card rounded-2xl border border-border p-6 card-hover h-full flex flex-col justify-between shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-bold text-secondary">
                          <Newspaper className="w-3.5 h-3.5 text-secondary" />
                        </span>
                        {n.date && <span>{n.date}</span>}
                      </div>
                      <h3 className="font-heading font-bold text-lg text-foreground">{n.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {n.summary || n.content || n.desc}
                      </p>
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

export default News;