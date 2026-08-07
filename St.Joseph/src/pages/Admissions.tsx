import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { ClipboardList, FileText, UserCheck, CreditCard, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Enquiry", desc: "Visit the school or fill out the online enquiry form to begin the process." },
  { icon: FileText, title: "Application", desc: "Submit the completed application form along with required documents." },
  { icon: UserCheck, title: "Assessment", desc: "Students appear for an age-appropriate assessment/interaction." },
  { icon: CreditCard, title: "Enrollment", desc: "Upon selection, complete the admission formalities and fee payment." },
];

const docs = ["Birth Certificate", "Previous School Transfer Certificate", "Report Card of Last Class", "Passport Size Photographs (4)", "Aadhar Card Copy", "Parent's ID Proof"];

const Admissions = () => (
  <Layout>
    <PageHero title="Admissions" subtitle="Join the St. Joseph's family – Admissions Open!" breadcrumb="Admissions" />
    <section className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="section-title">Admission Process</h2>
            <div className="gold-underline" />
            <p className="section-subtitle">A simple four-step process to begin your child's journey with us.</p>
          </div>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.1}>
              <div className="bg-card rounded-xl border border-border p-6 text-center card-hover relative">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-heading font-bold">
                  {i + 1}
                </div>
                <s.icon className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-heading font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <AnimatedSection>
            <div className="bg-cream rounded-2xl p-8">
              <h3 className="font-heading font-bold text-xl text-primary mb-4">Required Documents</h3>
              <ul className="space-y-3">
                {docs.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-secondary shrink-0" /> {d}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
              <h3 className="font-heading font-bold text-xl text-secondary mb-4">Admissions Open 2026-27</h3>
              <p className="text-primary-foreground/80 mb-6">
                We are now accepting applications for the upcoming academic session. Limited seats available for all classes.
              </p>
              <Link to="/contact" className="btn-secondary inline-flex items-center gap-2">
                Enquire Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  </Layout>
);

export default Admissions;