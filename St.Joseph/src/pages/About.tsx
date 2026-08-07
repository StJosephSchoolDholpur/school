import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import schoolBuilding from "@/assets/school-building.png";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import { Target, Eye, Heart, BookOpen, Users, GraduationCap, Trophy, Shield, Globe, Star, ArrowRight, Sparkles, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let cur = 0;
    const step = target / 125;
    const t = setInterval(() => { cur += step; if (cur >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [started, target]);
  return <div ref={ref}>{count}{suffix}</div>;
};

const milestones = [
  { year: "2001", title: "School Founded", desc: "Established with a vision of holistic education." },
  { year: "2005", title: "CBSE Affiliation", desc: "Received affiliation from CBSE, New Delhi." },
  { year: "2010", title: "New Campus", desc: "Moved to the current state-of-the-art campus." },
  { year: "2015", title: "Digital Classrooms", desc: "Introduced smart boards and digital learning." },
  { year: "2020", title: "Sports Academy", desc: "Launched dedicated sports training programs." },
  { year: "2025", title: "100% Results", desc: "Achieved 100% board exam pass rate." },
];

const About = () => (
  <Layout>
    <PageHero title="About Us" subtitle="Discover our legacy of educational excellence" breadcrumb="About Us" />

    {/* Story section */}
    <section className="section-padding overflow-hidden">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <AnimatedSection>
            <span className="text-secondary font-semibold text-sm tracking-wider uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Our Story
            </span>
            <h2 className="section-title mt-2">A Legacy of Excellence</h2>
            <div className="w-16 h-1 bg-secondary mt-3 mb-6 rounded-full" />
            <p className="text-muted-foreground leading-relaxed mb-4">
              St. Joseph's International School, Dholpur was established with a vision to provide world-class education in the heart of Rajasthan. Affiliated to CBSE, New Delhi, our school has been a cornerstone of academic excellence and character formation.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our institution believes in nurturing every child's potential through a balanced curriculum that emphasizes academics, moral values, sports, and co-curricular activities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With state-of-the-art infrastructure, experienced faculty, and a nurturing environment, we continue to set benchmarks in educational excellence.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: Shield, text: "Safe Campus" },
                { icon: Globe, text: "Global Vision" },
                { icon: Heart, text: "Value Based" },
                { icon: Star, text: "Top Results" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                  <item.icon className="w-4 h-4 text-secondary shrink-0" /> {item.text}
                </div>
              ))}
            </div>
            <Link to="/vision-mission" className="btn-primary inline-flex items-center gap-2">
              Our Vision <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="relative">
              <div className="bg-secondary/20 rounded-2xl p-3 relative overflow-hidden">
                <img src={schoolBuilding} alt="School Campus" className="rounded-xl w-full shadow-lg" />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute top-6 right-6 bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-xs font-bold shadow-lg"
                >
                  ⭐ Since 2001
                </motion.div>
              </div>
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-xl p-4 border border-border"
              >
                <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
              </motion.div>
              <motion.div animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-xl shadow-xl p-4 hidden md:block"
              >
                <p className="text-2xl font-heading font-bold">25+</p>
                <p className="text-xs text-primary-foreground/70">Years</p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Stats bar */}
    <section className="bg-primary py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 2000, suffix: "+", label: "Students", icon: Users },
            { value: 100, suffix: "+", label: "Faculty", icon: GraduationCap },
            { value: 50, suffix: "+", label: "Awards", icon: Trophy },
            { value: 25, suffix: "+", label: "Years", icon: Award },
          ].map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.1}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <s.icon className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">
                  <CountUp target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-primary-foreground/60 text-sm">{s.label}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Core Values */}
    <section className="section-padding bg-cream relative overflow-hidden">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        className="absolute -top-32 -right-32 w-64 h-64 border border-secondary/10 rounded-full"
      />
      <div className="container mx-auto text-center relative z-10">
        <AnimatedSection>
          <span className="text-secondary font-semibold text-sm tracking-wider uppercase flex items-center gap-2 justify-center">
            <Heart className="w-4 h-4" /> Our Foundation
          </span>
          <h2 className="section-title mt-2">Our Core Values</h2>
          <div className="gold-underline" />
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[
            { icon: Target, title: "Excellence", desc: "Pursuing the highest standards in everything we do.", color: "bg-blue-500/10" },
            { icon: Eye, title: "Integrity", desc: "Building character through honesty and transparency.", color: "bg-emerald-500/10" },
            { icon: Heart, title: "Compassion", desc: "Fostering empathy and kindness in our community.", color: "bg-rose-500/10" },
            { icon: BookOpen, title: "Innovation", desc: "Embracing creativity and modern learning approaches.", color: "bg-amber-500/10" },
          ].map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.1}>
              <motion.div whileHover={{ y: -8, scale: 1.03 }}
                className="bg-card p-7 rounded-xl border border-border group hover:border-secondary/40 hover:shadow-xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-14 h-14 ${v.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <v.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection>
          <div className="text-center">
            <span className="text-secondary font-semibold text-sm tracking-wider uppercase flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" /> Our Journey
            </span>
            <h2 className="section-title mt-2">Milestones</h2>
            <div className="gold-underline" />
          </div>
        </AnimatedSection>
        <div className="relative mt-12 max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />
          {milestones.map((m, i) => (
            <AnimatedSection key={m.year} delay={i * 0.1}>
              <div className={`flex gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="hidden md:block md:w-1/2" />
                <div className="relative">
                  <motion.div whileHover={{ scale: 1.2 }}
                    className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-heading font-bold text-xs z-10 relative shadow-lg"
                  >
                    {m.year}
                  </motion.div>
                </div>
                <motion.div whileHover={{ y: -3 }}
                  className="flex-1 bg-card rounded-xl p-5 border border-border hover:border-secondary/30 hover:shadow-lg transition-all"
                >
                  <h4 className="font-heading font-bold text-foreground mb-1">{m.title}</h4>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </motion.div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <motion.div animate={{ x: [-30, 30, -30] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"
      />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Want to Be Part of Our <span className="text-secondary">Family</span>?
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Discover what makes St. Joseph's the best choice for your child's future.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions" className="btn-secondary inline-flex items-center gap-2">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-primary-foreground/20 inline-flex items-center gap-2">
              Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </Layout>
);

export default About;