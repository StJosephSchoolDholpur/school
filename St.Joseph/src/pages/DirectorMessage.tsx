import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Quote, Star, Heart, BookOpen, Award, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import DirectorImage from "../assets/Director.png";
 
const DirectorMessage = () => (
  <Layout>
    <PageHero
      title="Director's Message"
      subtitle="Words of wisdom from our visionary Director"
      breadcrumb="Director's Message"
    />
 
    <section className="section-padding">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection>
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-sm" />
 
            <div className="relative bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
 
              {/* Top banner strip */}
              <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
 
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-tr-full pointer-events-none" />
 
              <div className="p-6 sm:p-10 md:p-14 relative z-10">
 
                {/* ── Director Profile Block ── */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
 
                  {/* Photo with ring + badge */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="relative">
                      {/* Animated ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-2 rounded-2xl border-2 border-dashed border-primary/30"
                      />
                      <div className="w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-muted relative z-10">
                        <img
                          src={DirectorImage}
                          alt="Sharrif Khan - Director, St. Joseph's International School"
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `
                              <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#e8f0ff,#f0e8ff);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#6366f1" stroke-width="1.2">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                <p style="font-size:11px;color:#888;margin-top:8px;">Director</p>
                              </div>
                            `;
                          }}
                        />
                      </div>
                      {/* Award badge */}
                      <div className="absolute -bottom-3 -right-3 z-20 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    </div>
 
                    {/* Name card below photo */}
                    <div className="text-center mt-4">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-0.5">
                        Director
                      </p>
                      <h2 className="font-heading font-extrabold text-primary text-lg sm:text-xl leading-tight">
                        Mr. Sharrif Khan
                      </h2>
                      {/* Decorative dots */}
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded" />
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      </div>
                    </div>
                  </div>
 
                  {/* Right side: school info + intro */}
                  <div className="flex-1 flex flex-col justify-start text-center md:text-left">
                    {/* School label */}
                    <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-4 self-center md:self-start">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary tracking-wide">
                        St. Joseph's International School, Dholpur
                      </span>
                    </div>
 
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mb-3">
                      A Message of <br className="hidden sm:block" />
                      <span className="text-primary">Vision & Hope</span>
                    </h3>
 
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
                      Guided by the belief that every child deserves the best start in life,
                      our institution stands as a beacon of quality education, strong values,
                      and lifelong learning.
                    </p>
 
                    {/* Stats row */}
                  
                  </div>
                </div>
 
                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
 
                {/* ── Message Body ── */}
                <div className="relative">
                  <Quote className="w-14 h-14 text-primary/10 absolute -top-2 -left-2" />
 
                  <div className="pl-2">
                    <p className="text-foreground leading-relaxed mb-5 text-base sm:text-lg italic font-medium">
                      "Dear Parents, Students, Staff Members, and Well-Wishers,
                    </p>
 
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                      With immense pride and great pleasure, I welcome you to our school's website.
                      Whether you are a parent, student, staff member, or anyone seeking deeper insights
                      into our institution, I invite you to explore our "online school" to understand the
                      environment we provide for holistic learning and growth.
                    </p>
 
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                      Since our inception, our institution has consistently moved forward with the mission
                      of spreading the light of education and paving the path of academic excellence for
                      every learner. Our continuous journey reflects our commitment to creating
                      opportunities, challenging minds, encouraging innovation, and sustaining excitement
                      in learning.
                    </p>
 
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                      Our objective is to be recognized as a torchbearer of progressive education—an
                      institution that empowers students to shape not only their own futures but also
                      contribute meaningfully to the world. We strive to provide an environment that
                      nurtures values, discipline, and confidence, helping students grow into responsible
                      global citizens.
                    </p>
 
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                      We remain dedicated to ensuring brighter and more secure prospects for our children.
                      The values and environment we offer are designed to support them through their
                      formative years and beyond, enabling them to achieve excellence and reach greater
                      heights.
                    </p>
 
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                      I extend my sincere gratitude to our Principal, dedicated teachers, and supportive
                      staff members whose commitment and hard work make our achievements possible. Beyond
                      academics, they instill values of discipline, zeal, and pride in every student.
                    </p>
 
                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base italic">
                      Once again, I warmly welcome you and sincerely hope that our website inspires you
                      to take a meaningful step toward making a positive difference in your life."
                    </p>
                  </div>
                </div>
 
                {/* ── Signature Block ── */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20 flex-shrink-0">
                        <img
                          src={DirectorImage}
                          alt="Sharrif Khan"
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:#e8f0ff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#6366f1;">SK</div>`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-primary text-base sm:text-lg">
                          Mr. Sharrif Khan
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Director — St. Joseph's International School, Dholpur
                        </p>
                      </div>
                    </div>
 
                    {/* Signature flourish */}
                    <div className="hidden sm:block text-right">
                      <p className="font-heading italic text-2xl text-primary/30 select-none">
                        Sharrif Khan
                      </p>
                    </div>
                  </div>
                </div>
 
              </div>
            </div>
          </div>
        </AnimatedSection>
 
        {/* ── Vision Cards ── */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-12">
          {[
            {
              icon: Star,
              title: "Excellence",
              desc: "Striving for the highest standards in education and student development",
              color: "from-amber-500/10 to-amber-500/5",
              iconColor: "text-amber-500",
              iconBg: "bg-amber-500/10",
            },
            {
              icon: Heart,
              title: "Values",
              desc: "Building strong character through faith, discipline, and compassion",
              color: "from-rose-500/10 to-rose-500/5",
              iconColor: "text-rose-500",
              iconBg: "bg-rose-500/10",
            },
            {
              icon: BookOpen,
              title: "Innovation",
              desc: "Embracing modern teaching methods while preserving traditional values",
              color: "from-primary/10 to-primary/5",
              iconColor: "text-primary",
              iconBg: "bg-primary/10",
            },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={0.2 + i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`bg-gradient-to-br ${item.color} rounded-2xl border border-border p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);
 
export default DirectorMessage;