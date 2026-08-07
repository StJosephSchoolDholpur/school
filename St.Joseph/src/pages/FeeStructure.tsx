import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { IndianRupee, Info, ShieldCheck, CheckCircle2 } from "lucide-react";
import { fetchFeeStructure, FeeSection } from "@/lib/db";

const FeeStructure = () => {
  const [feeSections, setFeeSections] = useState<FeeSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeStructure()
      .then((data) => {
        setFeeSections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("FeeStructure fetch error", err);
        setLoading(false);
      });

    const handleSync = () => {
      fetchFeeStructure().then(setFeeSections).catch(console.error);
    };
    window.addEventListener("stjoseph_db_updated", handleSync);
    return () => window.removeEventListener("stjoseph_db_updated", handleSync);
  }, []);

  return (
    <Layout>
      <PageHero
        title="Fee Structure"
        subtitle="Transparent, affordable and high-value education fee breakdown"
        breadcrumb="Fee Structure"
      />

      <section className="section-padding bg-gradient-to-b from-slate-50 via-background to-muted/20">
        <div className="container mx-auto max-w-5xl space-y-10">

          {/* Banner */}
          <AnimatedSection>
            <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-full text-xs font-semibold text-secondary">
                  <ShieldCheck className="w-4 h-4" /> Academic Session 2026-27
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold">
                  Transparent & Standardized Fee Structure
                </h2>
                <p className="text-primary-foreground/80 text-sm max-w-xl">
                  No hidden costs. Dynamic updates are published by the administration with full clarity on tuition, exam, and activity fees.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[200px]">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">Admission Helplines</p>
                <p className="text-lg font-heading font-extrabold text-white mt-1">+91-88245-51683</p>
                <p className="text-xs text-primary-foreground/70">Mon - Sat | 8:00 AM - 4:00 PM</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Dynamic Fee Cards */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground font-semibold">
              Loading Fee Structure...
            </div>
          ) : feeSections.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-10 text-center space-y-3 shadow-md">
              <IndianRupee className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="text-xl font-heading font-extrabold text-primary">Fee Structure Updating</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No active fee structure entries were found in the database. Updated fee charts will be published shortly by school administration.
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {feeSections.map((section, idx) => (
                <AnimatedSection key={section.id || idx}>
                  <div className="bg-card rounded-3xl border border-border/80 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Header bar */}
                    <div className="bg-primary/5 border-b border-border/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-heading font-extrabold text-primary">
                          {section.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-secondary" /> Initial payable at admission approx: ₹{section.admissionPay}
                        </p>
                      </div>

                      <div className="bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl shadow-sm text-right">
                        <span className="text-[10px] uppercase font-bold text-secondary block">Total Yearly Fee</span>
                        <span className="text-xl font-heading font-extrabold flex items-center justify-end">
                          <IndianRupee className="w-4 h-4 text-secondary" /> {section.total}
                        </span>
                      </div>
                    </div>

                    {/* Table Details */}
                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground text-left text-xs uppercase font-bold tracking-wider">
                            <th className="pb-3">Fee Particular / Component</th>
                            <th className="pb-3 text-right">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {section.data.map((item, i) => (
                            <tr key={i} className="hover:bg-muted/30 transition-colors">
                              <td className="py-3 text-foreground font-medium">{item.label}</td>
                              <td className="py-3 text-right font-bold text-foreground flex items-center justify-end gap-0.5">
                                <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                {item.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Notes Card */}
          <AnimatedSection>
            <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 text-sm text-muted-foreground">
              <Info className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-foreground text-base">Important Rules Regarding Fee Payments</h4>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Fees must be paid on or before the 10th of every quarter/month.</li>
                  <li>Late fees apply after due dates as per school norms.</li>
                  <li>Transport fees are calculated separately based on bus route distance.</li>
                  <li>Fee structures are dynamically managed and verified by St. Joseph's International School management.</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </section>
    </Layout>
  );
};

export default FeeStructure;