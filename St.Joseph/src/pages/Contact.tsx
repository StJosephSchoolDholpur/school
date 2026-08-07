import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

 
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

    const phoneNumber = "918058100465"; // WhatsApp number in international format (no +, no -, no spaces)
    
  const message = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}
Message: ${formData.message}
`;
 
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
 
    window.open(url, "_blank");
 
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you" breadcrumb="Contact" />
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="space-y-6">
              {[
                { icon: MapPin, title: "Address", info: "St. Joseph's International School, Dholpur, Rajasthan, India" },
                { icon: Phone, title: "Phone", info: "+91‑88245-51683" },
                { icon: Mail, title: "Email", info: "st.josephDholpur.com" },
                { icon: Clock, title: "Office Hours", info: "Mon–Sat: 8:00 AM – 3:00 PM" },
              ].map((c, i) => (
                <AnimatedSection key={c.title} delay={i * 0.1}>
                  <div className="flex items-start gap-4 bg-card rounded-xl p-5 border border-border card-hover">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <c.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.info}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.2}>
                <div className="bg-card rounded-2xl border border-border p-8">
                  <h2 className="font-heading font-bold text-2xl text-primary mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      <input type="email" placeholder="Your Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <textarea placeholder="Your Message" rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
                    <button type="submit" className="btn-primary inline-flex items-center gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;