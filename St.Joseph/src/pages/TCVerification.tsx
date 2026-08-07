import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import {
  searchTCByDetails,
  searchTCByNumberOrRoll,
  TCRecordData
} from "@/lib/supabase";
import {
  ShieldCheck,
  Search,
  FileCheck,
  Eye,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  X
} from "lucide-react";

const schoolClasses = [
  "Select Class",
  "Nursery", "LKG", "UKG",
  "Class I", "Class II", "Class III", "Class IV", "Class V",
  "Class VI", "Class VII", "Class VIII", "Class IX", "Class X",
  "Class XI", "Class XII",
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const cleanDateStr = String(dateStr).split("T")[0];
  const parts = cleanDateStr.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${day} ${months[monthIndex]} ${year}`;
    }
  }
  return dateStr;
}

const TCVerification = () => {
  // Public Search State
  const [searchMode, setSearchMode] = useState<"details" | "tcNo">("details");
  const [studentName, setStudentName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [tcNumberInput, setTcNumberInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<TCRecordData | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ title: string; desc: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searched && (currentRecord || alertInfo)) {
      const timer = setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [searched, currentRecord, alertInfo]);

  const handlePublicSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSearched(true);
    setAlertInfo(null);
    setCurrentRecord(null);
    setShowPreview(false);

    try {
      let record: TCRecordData | null = null;

      if (searchMode === "details") {
        if (!studentName.trim() || !selectedClass || selectedClass === "Select Class" || !dateOfBirth) {
          setAlertInfo({
            title: "Incomplete Details",
            desc: "Please fill in Student Name, Class, and Date of Birth to search."
          });
          setLoading(false);
          return;
        }
        record = await searchTCByDetails(studentName, selectedClass, dateOfBirth);
      } else {
        if (!tcNumberInput.trim()) {
          setAlertInfo({
            title: "Missing Input",
            desc: "Please enter a valid TC Number or Roll / SR Number."
          });
          setLoading(false);
          return;
        }
        record = await searchTCByNumberOrRoll(tcNumberInput);
      }

      if (record) {
        setCurrentRecord(record);
      } else {
        setAlertInfo({
          title: "No Record Found",
          desc: "No matching Transfer Certificate was found in our official database. Please double check student details or contact school administration."
        });
      }
    } catch (err: any) {
      console.error("Public TC Search Error:", err);
      setAlertInfo({
        title: "Database Search Error",
        desc: "Could not retrieve record. Please try again or contact administration."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHero
        title="TC Verification Portal"
        subtitle="Verify authentic Transfer Certificates issued by St. Joseph's International School"
        breadcrumb="TC Portal"
      />

      <section className="py-12 bg-gradient-to-b from-slate-50 via-background to-muted/20">
        <div className="container mx-auto px-4 max-w-4xl space-y-10">

          {/* Intro Card */}
          <AnimatedSection>
            <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-8 rounded-3xl shadow-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-full text-xs font-semibold text-secondary">
                <ShieldCheck className="w-4 h-4" /> Official CBSE Verification System
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold">
                Transfer Certificate LOOKUP
              </h2>
              <p className="text-primary-foreground/80 text-sm max-w-2xl leading-relaxed">
                Parents, educational institutions, and government authorities can verify student Transfer Certificates directly using SR / Roll Number, TC Number, or Student Details.
              </p>
            </div>
          </AnimatedSection>

          {/* Search Card */}
          <AnimatedSection>
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl space-y-6">

              {/* Search Mode Toggle */}
              <div className="flex items-center justify-center gap-3 bg-muted p-1.5 rounded-full max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setSearchMode("details")}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${searchMode === "details"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Search by Student Details
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode("tcNo")}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${searchMode === "tcNo"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Search by TC / Roll No.
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handlePublicSearch} className="space-y-6">
                {searchMode === "details" ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aarav Sharma"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Class *
                      </label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        {schoolClasses.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Enter TC Number or Roll / SR Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TC-2026-042 or 1001"
                      value={tcNumberInput}
                      onChange={(e) => setTcNumberInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-secondary" /> Searching Database...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 text-secondary" /> Verify Transfer Certificate
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>

          {/* SEARCH RESULT CONTAINER */}
          <div ref={resultRef}>
            {searched && alertInfo && (
              <AnimatedSection>
                <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 text-center space-y-2">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                  <h3 className="text-lg font-heading font-bold text-red-600">{alertInfo.title}</h3>
                  <p className="text-xs text-foreground/80 max-w-md mx-auto">{alertInfo.desc}</p>
                </div>
              </AnimatedSection>
            )}

            {searched && currentRecord && (
              <AnimatedSection>
                <div className="bg-card border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="bg-emerald-500 text-white text-[10px] uppercase font-extrabold tracking-widest py-1 px-8 absolute -right-12 top-6 rotate-45 shadow-sm">
                    Verified TC
                  </div>

                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <div>
                      <h3 className="text-xl font-heading font-extrabold text-foreground">
                        Official TC Record Found
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Verified authentic Transfer Certificate issued by St. Joseph's International School
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/40 rounded-2xl border border-border/50 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Student Name</span>
                      <p className="font-heading font-bold text-base text-foreground">{currentRecord.student_name}</p>
                    </div>

                    <div className="p-4 bg-muted/40 rounded-2xl border border-border/50 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Father's Name</span>
                      <p className="font-heading font-bold text-base text-foreground">{currentRecord.father_name}</p>
                    </div>

                    <div className="p-4 bg-muted/40 rounded-2xl border border-border/50 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Class & Roll / SR No</span>
                      <p className="font-heading font-bold text-base text-foreground">Class {currentRecord.class} | SR: {currentRecord.roll_no}</p>
                    </div>

                    <div className="p-4 bg-muted/40 rounded-2xl border border-border/50 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">TC Number & Issue Date</span>
                      <p className="font-heading font-bold text-base text-secondary">{currentRecord.tc_number} ({formatDate(currentRecord.issue_date)})</p>
                    </div>
                  </div>

                  {currentRecord.file_url && (
                    <div className="pt-4">
                      <button
                        onClick={() => setShowPreview(true)}
                        className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-secondary" /> Preview Certificate PDF
                      </button>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}
          </div>

        </div>
      </section>

      {/* PDF PREVIEW MODAL */}
      {showPreview && currentRecord?.file_url && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <h3 className="font-heading font-bold text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-secondary" /> Transfer Certificate Preview - {currentRecord.student_name}
              </h3>
              <button onClick={() => setShowPreview(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-900 overflow-auto p-4 min-h-[480px] flex flex-col items-center justify-center">
              {currentRecord.file_url ? (
                <embed
                  src={currentRecord.file_url}
                  type="application/pdf"
                  className="w-full h-[65vh] rounded-xl bg-white"
                />
              ) : (
                <div className="text-center p-8 space-y-3 text-slate-300">
                  <FileCheck className="w-16 h-16 text-secondary mx-auto" />
                  <h4 className="font-heading font-bold text-lg text-white">Transfer Certificate Verified</h4>
                  <p className="text-xs text-slate-400">
                    Student: {currentRecord.student_name} | TC: {currentRecord.tc_number}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-card border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">
                Official TC Document Viewer
              </span>
              <a
                href={currentRecord.file_url}
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

export default TCVerification;
