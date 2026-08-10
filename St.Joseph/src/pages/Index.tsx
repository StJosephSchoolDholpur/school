import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Users, Trophy, BookOpen, Star, ArrowRight, Calendar,  Sparkles, Play, Phone, CheckCircle,  Quote } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import schoolBuilding from "@/assets/school-building.png";
import logo from "@/assets/logo.png";
import classroom from "@/assets/ClassRoom.jpeg"
import sports from "@/assets/Sports.jpg"
import SectionHeading from "@/components/SectionHeading";
import library from "@/assets/School-building.jpeg"
import { useEffect, useState } from "react";
import AdmissionPopup from  "../pages/Admissionpop"
import video from "@/assets/video.mp4"
import BirthdaySection from "@/components/BirthdaySection";
import { fetchEvents, fetchNews } from "@/lib/db";
import {
  MapPin, Clock,
  Globe, Shield
} from "lucide-react";


// const heroVideos = [
//   "https://videos.pexels.com/video-files/8617752/8617752-uhd_2560_1440_25fps.mp4",
//   "https://videos.pexels.com/video-files/8466014/8466014-uhd_2560_1440_25fps.mp4",
//   "https://videos.pexels.com/video-files/5198159/5198159-uhd_2560_1440_25fps.mp4",
//   "https://videos.pexels.com/video-files/4144923/4144923-uhd_2560_1440_24fps.mp4",
// ];


// // ─── DATA ────────────────────────────────────────────────────────
const heroSlides = [
  {
    tagline: "Affiliated to CBSE, New Delhi – 1731119",
    title: <>St. Joseph's<br /><span className="text-secondary">International</span> School</>,
    desc: "Nurturing young minds with faith, knowledge, and excellence in education at Dholpur, Rajasthan.",
  },
  {
    tagline: "Admissions Open 2026-27",
    title: <>Shape Your Child's<br /><span className="text-secondary">Bright Future</span></>,
    desc: "Join a community of learners where every student is empowered to achieve academic excellence.",
  },
  {
    tagline: "Holistic Education",
    title: <>Where <span className="text-secondary">Values</span> Meet<br />Excellence</>,
    desc: "A perfect blend of academics, sports, arts, and character development for tomorrow's global citizens.",
  },
];









// const marqueeItems = [
//   "🏆 100% Board Exam Pass Rate 2025",
//   "📚 Admissions Open for 2026-27",

//   "🎨 National Art Competition Winners",
//   // "🔬 Science Olympiad Gold Medalists",
//   "📅 Annual Day Celebrations - April 2026",
// ];

// ─── HELPER COMPONENTS ──────────────────────────────────────────

function ClipboardIcon(props: any) { return <BookOpen {...props} />; }
function CreditCardIcon(props: any) { return <Zap {...props} />; }

const CountUpNumber = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return <div ref={ref}>{count}{suffix}</div>;
};

// ─── MARQUEE ─────────────────────────────────────────────────────
// const Marquee = () => (
//   <div className="bg-secondary overflow-hidden py-2.5 relative z-30">
//     <motion.div
//       animate={{ x: [0, -2000] }}
//       transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
//       className="flex gap-12 whitespace-nowrap"
//     >
//       {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
//         <span key={i} className="text-secondary-foreground font-semibold text-sm flex items-center gap-2">
//           {item}
//           <span className="text-secondary-foreground/40">●</span>
//         </span>
//       ))}
//     </motion.div>
//   </div>
// );

// ─── HERO ────────────────────────────────────────────────────────
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
 const slide = heroSlides[currentSlide]; 
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  


const [showPopup, setShowPopup] = useState(false);

useEffect(() => {
  const alreadyShown = sessionStorage.getItem("admissionPopup");
  if (!alreadyShown) {
    const timer = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem("admissionPopup", "shown");
    }, 1500); // 1.5 second delay after page load
    return () => clearTimeout(timer);
  }
}, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Multi-layer animated BG */}
  <h1 className="hidden">The best CBSE School in Dholpur</h1>

      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.video
            key={currentVideo}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 9, ease: "easeOut" } }}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            poster={schoolBuilding}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <img src={schoolBuilding} alt="Campus" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
      </div>
 <AdmissionPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
      />
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          {/* Left text – 3 cols */}
          <div className="lg:col-span-3 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.7 }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-5 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-md border border-secondary/30"
                >
                  <motion.span animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                    <Sparkles className="w-4 h-4" />
                  </motion.span>
                  {slide.tagline}
                </motion.span>
                <p className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground leading-[1.1] mb-6">
                  {slide.title}
                </p>
                <p className="text-lg md:text-xl text-primary-foreground/75 mb-8 max-w-lg font-body leading-relaxed">
                  {slide.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTA buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4 mb-8">
              <Link to="/admissions" className="group btn-secondary inline-flex items-center gap-2 text-base shadow-xl shadow-secondary/30 relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Apply Now
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </span>
              </Link>
              <Link to="/about" className="bg-primary-foreground/10 text-primary-foreground backdrop-blur-md border border-primary-foreground/20 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-primary-foreground/20 inline-flex items-center gap-2">
                <Play className="w-4 h-4" /> Virtual Tour
              </Link>
              <Link to="/contact" className="bg-primary-foreground/5 text-primary-foreground backdrop-blur-md border border-primary-foreground/10 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-primary-foreground/15 inline-flex items-center gap-2">
                <Phone className="w-4 h-4" /> Contact
              </Link>
            </motion.div>

            {/* Info strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-wrap gap-5 text-primary-foreground/50 text-sm">
              {[
                { icon: MapPin, text: "Dholpur, Rajasthan" },
                { icon: GraduationCap, text: "CBSE Affiliated" },
                { icon: Users, text: "2000+ Students" },
                { icon: Clock, text: "Est. 2001" },
              ].map((info) => (
                <span key={info.text} className="flex items-center gap-1.5">
                  <info.icon className="w-3.5 h-3.5 text-secondary" /> {info.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right cards – 2 cols */}
          
        </div>
      </div>

      {/* Progress bar for slide timer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-primary-foreground/10">
        <motion.div
          key={currentSlide}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-secondary"
        />
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all duration-500 ${i === currentSlide ? "w-10 bg-secondary" : "w-2 bg-primary-foreground/25 hover:bg-primary-foreground/50"}`}
          />
        ))}
      </div>
    </section>
  );
};

const stats = [
  { icon: Users, value: "500+", label: "Students" },
  { icon: GraduationCap, value: "30+", label: "Faculty" },
  { icon: Trophy, value: "10+", label: "Awards" },
  { icon: BookOpen, value: "7+", label: "Years" },
];

const features = [
  { title: "CBSE Curriculum", desc: "Affiliated to CBSE, New Delhi ensuring national standard education.", icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
  { title: "Holistic Development", desc: "Focus on academics, sports, arts, and character building.", icon: Star, color: "bg-amber-500/10 text-amber-600" },
  { title: "Expert Faculty", desc: "Experienced and dedicated teachers committed to excellence.", icon: Users, color: "bg-emerald-500/10 text-emerald-600" },
  { title: "Modern Infrastructure", desc: "State-of-the-art classrooms, labs, and sports facilities.", icon: Trophy, color: "bg-purple-500/10 text-purple-600" },
  { title: "Safe Environment", desc: "CCTV monitored campus with trained security personnel.", icon: Shield, color: "bg-red-500/10 text-red-600" },
  { title: "Global Exposure", desc: "International collaborations and exchange programs.", icon: Globe, color: "bg-cyan-500/10 text-cyan-600" },
];

const news = [
  { title: "Annual Sports Day 2026", date: "March 15, 2026", desc: "Join us for an exciting day of athletic competition and school spirit." },
  { title: "Science Exhibition", date: "April 5, 2026", desc: "Students showcase creative science projects and practical experiments." },
  { title: "Parent-Teacher Meeting", date: "March 22, 2026", desc: "Discuss your child's progress with our dedicated faculty members." },
];

const testimonials = [
  { name: "Dr.Manoj Tyagi", role: "Parent of Class X and  VIII Student", text: "St. Joseph's has been a wonderful journey for my child. The teachers are caring and the environment is perfect for holistic growth.", rating: 5 },
  { name: "Mr. Reena Agarwal", role: "Parent of Class X Student", text: "The academic results and values imparted here are exceptional. My son has grown tremendously in confidence and knowledge.", rating: 5 },
  { name: "Mr. Brijnandan Dubey", role: "Parent of Class X Student", text: "We are delighted with the all-round development our daughter has achieved. The co-curricular activities are outstanding.", rating: 5 },
];
// ─── HERO ────────────────────────────────────────────────────────

const Index = () => {
  const [dynamicNewsEvents, setDynamicNewsEvents] = useState<Array<{
    title: string;
    date: string;
    desc: string;
    category?: string;
    link: string;
  }>>([
    { title: "Annual Sports Day 2026", date: "March 15, 2026", desc: "Join us for an exciting day of athletic competition and school spirit.", category: "Sports", link: "/events" },
    { title: "Science Exhibition", date: "April 5, 2026", desc: "Students showcase creative science projects and practical experiments.", category: "Academic", link: "/events" },
    { title: "Parent-Teacher Meeting", date: "March 22, 2026", desc: "Discuss your child's progress with our dedicated faculty members.", category: "Announcement", link: "/news" },
  ]);

  useEffect(() => {
    Promise.all([fetchEvents(), fetchNews()])
      .then(([eventsData, newsData]) => {
        const combined: Array<{
          title: string;
          date: string;
          desc: string;
          category?: string;
          link: string;
          timestamp: number;
        }> = [];

        eventsData.forEach((ev) => {
          const time = new Date(ev.date || (ev as any).created_at).getTime();
          combined.push({
            title: ev.title,
            date: ev.date || "Upcoming",
            desc: ev.shortDesc || ev.fullDesc || ev.description || "Official St. Joseph School Event",
            category: ev.category || "Event",
            link: "/events",
            timestamp: isNaN(time) ? Date.now() : time
          });
        });

        newsData.forEach((n) => {
          const time = new Date(n.date || (n as any).created_at).getTime();
          combined.push({
            title: n.title,
            date: n.date || "Announcement",
            desc: n.summary || n.content || "Official announcement from school administration",
            category: n.category || "News",
            link: "/news",
            timestamp: isNaN(time) ? Date.now() : time
          });
        });

        // Strictly sort by timestamp descending so NEWEST is ALWAYS at index 0 (top left!)
        combined.sort((a, b) => b.timestamp - a.timestamp);

        if (combined.length > 0) {
          setDynamicNewsEvents(combined.slice(0, 3));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}


  <HeroSection/>


      {/* Stats */}
      <section className="relative -mt-16 z-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-card rounded-xl shadow-lg p-6 text-center card-hover border border-border bg-white"
              >
                <stat.icon className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-3xl font-heading font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="text-secondary font-semibold text-sm tracking-wider uppercase">Welcome to</span>
              <h2 className="section-title mt-2">St. Joseph's International School</h2>
              <div className="w-16 h-1 bg-secondary mt-3 mb-6 rounded-full" />
              <p className="text-muted-foreground leading-relaxed mb-4">
                St. Joseph's International School, Dholpur stands as a beacon of educational excellence in Rajasthan. Our school is committed to providing a comprehensive education that nurtures the intellectual, physical, spiritual, and emotional growth of every student.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                With a rich tradition of academic achievement and holistic development, we prepare our students to become responsible global citizens equipped with the knowledge and values to excel in an ever-changing world.
              </p>
              <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                Read More <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="bg-secondary/20 rounded-2xl p-3">
                  <img src={schoolBuilding} alt="School Campus" className="rounded-xl w-full shadow-lg" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-xl p-4 border border-border">
                  <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features */}
   <section className="section-padding  relative overflow-hidden bg-[#ede8d7]">
        {/* Background decoration */}
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 border border-secondary/10 rounded-full"
        />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-60 h-60 border border-primary/10 rounded-full"
        />
        <div className="container mx-auto text-center relative z-10">
          <AnimatedSection>
            <span className="text-secondary font-semibold text-sm tracking-wider uppercase flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" /> Why Choose Us
            </span>
            <h2 className="section-title mt-2">Excellence in Every Dimension</h2>
            <div className="gold-underline" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-card rounded-xl p-7 border border-border bg-white h-full text-left group hover:border-secondary/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`w-14 h-14 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                    <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="section-padding ">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center">
              <span className="text-secondary font-semibold text-sm tracking-wider uppercase flex items-center gap-2 justify-center">
                <Quote className="w-4 h-4" /> What Parents Say
              </span>
              <h2 className="section-title mt-2">Trusted by 800+ Families</h2>
              <div className="gold-underline" />
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }}
                  className="bg-card rounded-xl p-7 border border-border h-full relative group hover:shadow-xl transition-all "
                >
                  <Quote className="w-8 h-8 text-secondary/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-heading font-bold text-sm">{t.name[0]}{t.name.split(" ").pop()?.[0]}</span>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events */}
<section className="relative w-full">
  {/* Background Image (fixed) */}
  <div
    className="absolute inset-0 w-full h-full bg-cover bg-center"
    style={{
      backgroundImage: `url(${classroom})`,
      backgroundAttachment: "fixed", // fixed background for parallax
    }}
  />
  
  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Content */}
  <div className="relative z-10 container mx-auto py-10 text-center">
    <AnimatedSection>
      <span className="text-white font-semibold text-sm tracking-wider uppercase">
        Stay Updated
      </span>
      <h2 className="section-title mt-2 text-white">Latest News & Events</h2>
      <div className="gold-underline mx-auto" />
    </AnimatedSection>

    <div className="grid md:grid-cols-3 gap-6 mt-12">
      {dynamicNewsEvents.map((item, i) => (
        <AnimatedSection key={item.title + i} delay={i * 0.1}>
          <div className="bg-white rounded-xl overflow-hidden card-hover border border-border h-full flex flex-col justify-between text-left shadow-md hover:shadow-xl transition-all">
            <div>
              <div className="bg-primary/5 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-semibold text-muted-foreground">{item.date}</span>
                </div>
                {item.category && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-base text-foreground mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{item.desc}</p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2">
              <Link to={item.link} className="text-xs font-bold text-primary hover:text-secondary inline-flex items-center gap-1">
                Read Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>

    <div className="text-center mt-10">
      <Link to="/events" className="btn-primary inline-flex items-center gap-2">
        View All Events <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</section>






















  <section className="section-padding bg-cream">
      <div className="container mx-auto">
        <SectionHeading title="Campus Highlights" subtitle="Experience our world-class facilities designed for holistic development." />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { img: library, title: "School & Resources", link: "/infrastructure" },
            { img: sports, title: "Sports Complex", link: "/sports" },
            { img: classroom, title: "Smart Classrooms", link: "/academics" },
          ].map(({ img, title, link }) => (
            <Link key={title} to={link} className="group relative overflow-hidden rounded-xl aspect-[4/3]">
              <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-xl font-bold text-primary-foreground">{title}</h3>
                <p className="font-body text-gold text-sm flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={14} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>











      {/* Birthday Celebrations Section */}
      <BirthdaySection />

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
              Begin Your Child's Journey with Us
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
              Admissions are open for the upcoming academic session. Give your child the gift of quality education.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admissions" className="btn-secondary inline-flex items-center gap-2">
                Apply for Admission <ArrowRight className="w-4 h-4" />
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
};

export default Index;


