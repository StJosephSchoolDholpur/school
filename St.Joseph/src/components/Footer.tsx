import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";
const socials = [
  { icon: Facebook, link: "https://www.facebook.com/share/1bTmUwL1Lx/" },
  { icon: Instagram, link: "https://www.instagram.com/st.joseph.international_school?igsh=MXE5ajRkdWJsaWtlbQ==" },
  { icon: Youtube, link: "https://www.youtube.com/@st.josephsinternational_school" },
];
const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-12 object-contain rounded-full bg-primary-foreground/10 p-1"
              />
              <h3 className="font-heading text-lg font-bold">
                St. Joseph's International School
              </h3>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Affiliated to CBSE, New Delhi. Nurturing young minds with excellence in education, character building, and holistic development since establishment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-secondary mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Us", path: "/about" },
                { label: "Admissions", path: "/admissions" },
                { label: "Academics", path: "/academics" },
                { label: "Gallery", path: "/gallery" },
                { label: "Contact Us", path: "/contact" },
                { label: "Fee Structure", path: "/fee-structure" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/70 hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-heading font-semibold text-secondary mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Student Life", path: "/student-life" },
                { label: "Sports", path: "/sports" },
                { label: "Events", path: "/events" },
                { label: "Infrastructure", path: "/infrastructure" },
                { label: "Transportation", path: "/transportation" },
                { label: "Calendar", path: "/calendar" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/70 hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-secondary mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm mb-4">
              <p className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
                Ashiyana Colony, Jail Road, Near Railway Station, Dholpur, Rajasthan - 328001, India
              </p>
              <p className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4 shrink-0 text-secondary" /> +91‑99286-23387
              </p>
              <p className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4 shrink‑0 text-secondary" /> +91‑88245-51683
              </p>
              <p className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="w-4 h-4 shrink-0 text-secondary" /> stjosephdholpur@gmail.com
              </p>
            </div>

            {/* Embedded Google Map */}
            <div className="overflow-hidden rounded-lg border border-primary-foreground/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.7785342771713!2d77.90310307521611!3d26.687564576782172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3973ffd493b346b5%3A0x12d5f0eb71aaaf6a!2sSt.%20Joseph&#39;s%20International%20School%20Dholpur!5e0!3m2!1sen!2sin!4v1772108706949!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="St. Joseph's International School Dholpur"
              ></iframe>
            </div>

            <div className="flex gap-3 mt-4">
              {socials.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.link}
                    target="blank"
                    className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-4">
        <p className="text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} St. Joseph's International School, Dholpur. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;