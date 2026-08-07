import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Music, Palette, Drama, Globe, BookOpen, Camera, Mic, PenTool } from "lucide-react";

const activities = [
  { icon: Music, title: "Music & Dance", desc: "Classical and contemporary music training along with various dance forms." },
  { icon: Palette, title: "Art & Painting", desc: "Developing creativity through drawing, painting, and visual arts." },
  { icon: Drama, title: "Drama & Theatre", desc: "Building confidence through stage performances and theatrical arts." },
  { icon: Globe, title: "Model United Nations", desc: "Developing leadership and diplomatic skills through MUN simulations." },
  { icon: BookOpen, title: "Literary Club", desc: "Creative writing, poetry, debates, and public speaking activities." },
  { icon: Camera, title: "Photography Club", desc: "Learning photography techniques and visual storytelling." },
  { icon: Mic, title: "Public Speaking", desc: "Elocution, extempore, and oratory skills development." },
  { icon: PenTool, title: "Robotics Club", desc: "Hands-on experience with robotics and coding projects." },
];

const CoCurricular = () => (
  <Layout>
    <PageHero title="Co-Curricular Activities" subtitle="Beyond the classroom – nurturing diverse talents" breadcrumb="Co-Curricular" />
    <section className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="section-title">Explore Your Passion</h2>
            <div className="gold-underline" />
            <p className="section-subtitle">We offer a wide range of co-curricular activities to help students discover and develop their unique talents.</p>
          </div>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((a, i) => (
            <AnimatedSection key={a.title} delay={i * 0.06}>
              <div className="bg-card rounded-xl border border-border p-6 text-center card-hover h-full">
                <div className="w-14 h-14 bg-secondary/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <a.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default CoCurricular;