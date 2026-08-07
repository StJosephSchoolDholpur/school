import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import {
  FileText,
  Eye,
  Search,
  ShieldCheck,
  Building2,
  Award,
  X,
} from "lucide-react";
import { fetchMandatoryDocs, MandatoryDoc } from "@/lib/db";

const generalSchoolInfo = [
  { label: "Name of the School", value: "St. Joseph's International School" },
  { label: "Affiliation Number", value: "1731119" },
  { label: "School Code", value: "11616" },
  { label: "Complete Address", value: "Ashiyana Colony, Jail Road, Near Railway Station, Dholpur, Rajasthan - 328001" },
  { label: "Principal Name & Qualification", value: "Mr. Praveen Tyagi (M.A., B.Ed., PGDCA)" },
  { label: "School Email ID", value: "stjosephdholpur@gmail.com" },
  { label: "Contact Numbers", value: "+91-99286-23387 / +91-88245-51683" },
];

const MandatoryPublicDisclosure = () => {
  // Exactly 2 Tabs: "info" (General School Info) & "certificates" (Certificate and Affiliation)
  const [activeTab, setActiveTab] = useState<"info" | "certificates">("info");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string; type: string } | null>(null);
  const [dbDocs, setDbDocs] = useState<MandatoryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMandatoryDocs()
      .then((docs) => {
        setDbDocs(docs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading disclosure docs", err);
        setLoading(false);
      });
  }, []);

  const filteredDocs = dbDocs.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <PageHero
        title="Mandatory Public Disclosure"
        subtitle="Complete transparency, CBSE affiliations, safety certifications & official governance documents"
        breadcrumb="Mandatory Disclosure"
      />

      <section className="py-12 bg-gradient-to-b from-slate-50 via-background to-muted/20">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">

          {/* Quick Header Banner */}
          <AnimatedSection>
            <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-full text-xs font-semibold text-secondary">
                  <ShieldCheck className="w-4 h-4" /> CBSE Compliance Section 46 & 47
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold">
                  Public Disclosures & Certificates
                </h2>
                <p className="text-primary-foreground/80 text-sm max-w-xl">
                  Official affiliation letters, safety clearances, and general school information published for public verification.
                </p>
              </div>

              {/* Search Bar for Certificates */}
              {activeTab === "certificates" && (
                <div className="w-full md:w-72 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-full text-sm bg-white text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* EXACTLY 2 NAVIGATION TABS */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading font-bold text-sm transition-all shadow-sm ${
                activeTab === "info"
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card hover:bg-muted text-foreground/80 border border-border"
              }`}
            >
              <Building2 className="w-4 h-4 text-secondary" /> General School Info
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading font-bold text-sm transition-all shadow-sm ${
                activeTab === "certificates"
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card hover:bg-muted text-foreground/80 border border-border"
              }`}
            >
              <Award className="w-4 h-4 text-secondary" /> Certificate & Affiliation
            </button>
          </div>

          {/* TAB 1: GENERAL SCHOOL INFO */}
          {activeTab === "info" && (
            <AnimatedSection>
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="text-xl font-heading font-extrabold text-primary flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-secondary" /> General Information of School
                  </h3>
                  <span className="text-xs bg-secondary/15 text-secondary border border-secondary/30 px-3 py-1 rounded-full font-bold">
                    Official Profile
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {generalSchoolInfo.map((info, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted/30 rounded-2xl border border-border/60 flex flex-col justify-center space-y-1 hover:border-secondary/50 transition-colors"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {info.label}
                      </span>
                      <span className="font-heading font-bold text-foreground text-sm">
                        {info.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* TAB 2: CERTIFICATE & AFFILIATION */}
          {activeTab === "certificates" && (
            <AnimatedSection>
              <div className="space-y-6">
                <div className="border-b border-border pb-3 flex items-center justify-between">
                  <h3 className="text-xl font-heading font-extrabold text-primary flex items-center gap-2">
                    <Award className="w-5 h-5 text-secondary" /> Certificates & Affiliation Documents
                  </h3>
                  <span className="text-xs bg-secondary/15 text-secondary border border-secondary/30 px-3 py-1 rounded-full font-bold">
                    Official Certificates ({dbDocs.length})
                  </span>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-muted-foreground font-semibold">
                    Loading Disclosure Certificates...
                  </div>
                ) : filteredDocs.length === 0 ? (
                  <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3 shadow-md">
                    <Award className="w-12 h-12 text-secondary mx-auto" />
                    <h3 className="text-xl font-heading font-extrabold text-primary">No Disclosure Certificates Uploaded</h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      No certificates were found in the database. Upload affiliation, NOC, and safety documents via the Admin Panel to display them here.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-card border border-border/80 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-secondary/10 text-secondary rounded-full border border-secondary/20">
                              {doc.category || "Official Certificate"}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                              {doc.file_type || "pdf"}
                            </span>
                          </div>

                          <h4 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                            {doc.title}
                          </h4>
                        </div>

                        <div className="pt-5 mt-4 border-t border-border/40">
                          <button
                            onClick={() => setPreviewDoc({ title: doc.title, url: doc.file_url, type: doc.file_type || "pdf" })}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                          >
                            <Eye className="w-4 h-4 text-secondary" /> Preview Document
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}

        </div>
      </section>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <h3 className="font-heading font-bold text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" /> {previewDoc.title}
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Viewer */}
            <div className="flex-1 bg-slate-900 overflow-auto p-4 flex items-center justify-center min-h-[400px]">
              {previewDoc.type === "image" || previewDoc.url.endsWith(".png") || previewDoc.url.endsWith(".jpeg") || previewDoc.url.endsWith(".jpg") ? (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
                />
              ) : (
                <embed
                  src={previewDoc.url}
                  type="application/pdf"
                  className="w-full h-[65vh] rounded-xl bg-white"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-card border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">Official Document Reader</span>
              <a
                href={previewDoc.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-bold"
              >
                <Eye className="w-3.5 h-3.5" /> Open Fullscreen
              </a>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MandatoryPublicDisclosure;