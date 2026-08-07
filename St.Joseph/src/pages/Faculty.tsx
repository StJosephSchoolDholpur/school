import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { GraduationCap, BadgeCheck, FileText, Users } from "lucide-react";
import { fetchTeachers, Teacher } from "@/lib/db";

const defaultFacultyData: Record<string, { name: string; id?: string; reg?: string; photo_url?: string }[]> = {
  PRT: [
    { name: "Mrs. Yashmeen", id: "2041468", reg: "T22002041468" },
    { name: "Mrs. Brajbala Mishra", id: "2041469", reg: "T22002041469" },
    { name: "Mrs. Pooja Sharma", id: "2041470", reg: "T22002041470" },
  ],
  TGT: [
    { name: "Mrs. Tanu Brijesh Sharma", id: "3240822", reg: "T26003240822" },
    { name: "Mr. Vishnu Bansal", id: "3240756", reg: "REG-T26003240756" },
    { name: "Mrs. Aarti Sanjay Parmar", id: "3240734", reg: "126003240734" },
    { name: "Mrs. Shivani Gupta", id: "3199664", reg: "T25003199664" },
    { name: "Mr. Harendra Singh", id: "3199628", reg: "T25003199628" },
    { name: "Mrs. Kavita Singh", id: "2035653", reg: "T22002035653" },
    { name: "Mrs. Sarika Shrivastav", id: "2035604", reg: "122002035604" },
    { name: "Mr. Ajeej Khan", id: "2041513", reg: "T22002041513" },
  ],
  PGT: [
    { name: "Mrs. SARLA CHEJARA", id: "2041378", reg: "T22002041378" },
    { name: "Mrs. LALITA TYAGI", id: "2005332", reg: "T22002005332" },
  ],
  Principal: [
    { name: "Mr. PRAVEEN KUMAR TYAGI", id: "2041269", reg: "T22002041269" },
  ],
};

type TabType = "PRT" | "TGT" | "PGT" | "Principal";
const tabs: TabType[] = ["PRT", "TGT", "PGT", "Principal"];

const Faculty = () => {
  const [filter, setFilter] = useState<TabType>("PRT");
  const [dbTeachers, setDbTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers()
      .then((data) => {
        setDbTeachers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Combined faculty records matching active tab
  const facultyList = React.useMemo(() => {
    if (dbTeachers.length > 0) {
      const filtered = dbTeachers.filter((t) => {
        const dept = (t.department || t.designation || "").toUpperCase();
        return dept.includes(filter);
      });
      if (filtered.length > 0) return filtered;
    }
    return defaultFacultyData[filter] || [];
  }, [dbTeachers, filter]);

  return (
    <Layout>
      <PageHero
        title="Our Faculty"
        subtitle="Meet our dedicated team of educators"
        breadcrumb="Faculty"
      />
      <section className="section-padding">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="section-title">Experienced & Passionate Educators</h2>
              <div className="gold-underline" />
              <p className="section-subtitle">
                Our faculty members are highly qualified professionals dedicated
                to nurturing every student's potential.
              </p>
            </div>
          </AnimatedSection>

          {/* Tab Buttons */}
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 font-semibold text-xs
                  ${filter === tab
                    ? "bg-[#192457] text-white shadow-md scale-105"
                    : "bg-card text-foreground/80 border-border hover:bg-muted"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground font-semibold">
              Loading Faculty Records...
            </div>
          ) : (
            /* Faculty Cards */
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {facultyList.map((f, i) => (
                <AnimatedSection key={f.id || i} delay={i * 0.08}>
                  <div className="bg-card rounded-xl border border-border p-6 text-center card-hover h-full flex flex-col justify-between">
                    <div>
                      {f.photo_url ? (
                        <img
                          src={f.photo_url}
                          alt={f.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <GraduationCap className="w-10 h-10 text-primary" />
                        </div>
                      )}

                      <h3 className="font-heading font-semibold text-foreground mb-3 capitalize text-base">
                        {f.name.toUpperCase()}
                      </h3>
                    </div>

                    <div className="space-y-2 mt-2">
                      {f.id && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-1.5">
                          <BadgeCheck className="w-3.5 h-3.5 text-yellow-600" />
                          <span>ID: <strong className="text-foreground">{f.id}</strong></span>
                        </div>
                      )}
                      {(f as any).reg && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-1.5">
                          <FileText className="w-3.5 h-3.5 text-yellow-600" />
                          <span>Reg: <strong className="text-foreground">{(f as any).reg}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Faculty;