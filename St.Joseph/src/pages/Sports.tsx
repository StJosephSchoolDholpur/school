import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Trophy, Target, Users, Timer } from "lucide-react";

const sports = [
  { name: "Cricket", desc: "Professionally maintained cricket ground with coaching for all age groups." },
  { name: "Football", desc: "Full-size football field for training and inter-school competitions." },
  { name: "Basketball", desc: "Standard basketball courts for regular practice and tournaments." },
  { name: "Athletics", desc: "400m track for sprints, relay races, and long-distance running." },
  { name: "Badminton", desc: "Indoor badminton courts for year-round training." },
  { name: "Table Tennis", desc: "Multiple tables available for students of all classes." },
  { name: "Yoga", desc: "Regular yoga sessions for mental and physical wellness." },
  { name: "Kabaddi", desc: "Traditional Indian sport promoted for fitness and teamwork." },
];

const Sports = () => (
  <Layout>
    <PageHero title="Sports" subtitle="Building champions on and off the field" breadcrumb="Sports" />
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Trophy, label: "20+ Trophies", sub: "Won last year" },
            { icon: Target, label: "8 Sports", sub: "Offered" },
            { icon: Users, label: "5 Coaches", sub: "Professional" },
            { icon: Timer, label: "Daily", sub: "Training sessions" },
          ].map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.1}>
              <div className="bg-primary rounded-xl p-6 text-center text-primary-foreground">
                <s.icon className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <p className="font-heading font-bold text-lg">{s.label}</p>
                <p className="text-xs text-primary-foreground/70">{s.sub}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sports.map((s, i) => (
            <AnimatedSection key={s.name} delay={i * 0.06}>
              <div className="bg-card rounded-xl border border-border p-5 card-hover">
                <h3 className="font-heading font-semibold text-foreground mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Sports;