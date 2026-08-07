import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Eye, Target, Compass, Lightbulb } from "lucide-react";

const VisionMission = () => (
  <Layout>
    <PageHero title="Vision & Mission" subtitle="Our guiding principles for educational excellence" breadcrumb="Vision & Mission" />
    <section className="section-padding">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10">
          <AnimatedSection>
            <div className="bg-card rounded-2xl p-8 border border-border h-full card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                St. Joseph's International School is to empower student to acquire, demonstrate, Articulate and value knowledge and skills is that will support them, as life learners, to perticipate in and contribute to the global world and practice the core values of the school: Respect, Tolerance Inclusion and excellance.

              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <div className="bg-card rounded-2xl p-8 border border-border h-full card-hover">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are dedicated to fulfillings every child's educational and developmental needs in a safe and caring environment conducive to learning and teaching.

                we aim to create responsible, global citizens who show understanding, compassion and acceptance oh the differences in the world. we strive to ensure that every child in our care is empowered to make choice and encouraged to contribute to our community.
              </p>
            </div>
          </AnimatedSection>
        </div>
        <div className="grid md:grid-cols-2 gap-10 mt-10">
          {[
            { icon: Compass, title: "Our Philosophy", desc: "Education at St. Joseph's is guided by the belief that every child is unique and possesses inherent potential. We provide personalized attention and diverse opportunities for students to discover and develop their talents." },
            { icon: Lightbulb, title: "Our Approach", desc: "We adopt a learner-centered approach that combines traditional values with modern pedagogy. Through experiential learning, technology integration, and collaborative projects, we make education engaging and meaningful." },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={0.3 + i * 0.15}>
              <div className="bg-cream rounded-2xl p-8 h-full">
                <item.icon className="w-10 h-10 text-secondary mb-4" />
                <h3 className="font-heading font-bold text-xl text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default VisionMission;