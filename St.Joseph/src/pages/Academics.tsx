import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { BookOpen, FlaskConical, Globe, Calculator, Palette, Code } from "lucide-react";

const subjects = [
  { icon: BookOpen, name: "Languages", desc: "English, Hindi, and Sanskrit with emphasis on communication skills." },
  { icon: Calculator, name: "Mathematics", desc: "Strong foundation in mathematical concepts and problem-solving." },
  { icon: FlaskConical, name: "Sciences", desc: "Physics, Chemistry, and Biology with hands-on lab experiences." },
  { icon: Globe, name: "Social Sciences", desc: "History, Geography, Civics, and Economics for global awareness." },
  { icon: Code, name: "Computer Science", desc: "Modern IT skills, programming, and digital literacy." },
  { icon: Palette, name: "Arts & Music", desc: "Creative expression through visual arts, music, and performing arts." },
];

const Academics = () => (
  <Layout>
    <PageHero title="Academics" subtitle="Comprehensive education for holistic development" breadcrumb="Academics" />
    <section className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="section-title">Academic Programs</h2>
            <div className="gold-underline" />
            <p className="section-subtitle">We offer a robust academic program from Pre-Primary to Senior Secondary, aligned with CBSE standards.</p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[ "Primary (Classes I–V)", "Secondary (Classes VI–X)"].map((level, i) => (
            <AnimatedSection key={level} delay={i * 0.1}>
              <div className="bg-card rounded-xl border border-border p-6 card-hover">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="font-heading font-bold text-secondary">{i + 1}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{level}</h3>
                <p className="text-sm text-muted-foreground">Age-appropriate curriculum designed for comprehensive learning and development.</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="text-center mb-8">
            <h2 className="section-title">Subjects Offered</h2>
            <div className="gold-underline" />
          </div>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s, i) => (
            <AnimatedSection key={s.name} delay={i * 0.08}>
              <div className="bg-cream rounded-xl p-6 card-hover">
                <s.icon className="w-8 h-8 text-primary mb-3" />
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

export default Academics;