import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { BookOpen, Search, Filter, Book, Sparkles, ArrowLeft } from "lucide-react";
import { fetchBooks, BookItem } from "@/lib/db";

interface ClassBookGroup {
  className: string;
  category: "Primary" | "Middle" | "Secondary" | "Pre-Primary";
  books: { id: string; subject: string; title: string }[];
}

const categories = ["All", "Primary", "Middle", "Secondary"] as const;

const getClassCategory = (clsName: string): "Primary" | "Middle" | "Secondary" | "Pre-Primary" => {
  const match = clsName.match(/\d+/);
  const num = match ? parseInt(match[0], 10) : 0;
  if (num >= 1 && num <= 5) return "Primary";
  if (num >= 6 && num <= 8) return "Middle";
  if (num >= 9) return "Secondary";
  return "Pre-Primary";
};

const getClassSortWeight = (cls: string): number => {
  const lower = cls.toLowerCase();
  if (lower.includes("nursery")) return -3;
  if (lower.includes("lkg")) return -2;
  if (lower.includes("ukg")) return -1;
  const match = cls.match(/\d+/);
  return match ? parseInt(match[0], 10) : 99;
};

const Books = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [dbBooks, setDbBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks()
      .then((data) => {
        setDbBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading books from database", err);
        setLoading(false);
      });
  }, []);

  // Group database books dynamically by class_name
  const classBooksData = useMemo<ClassBookGroup[]>(() => {
    const map: Record<string, { id: string; subject: string; title: string }[]> = {};
    dbBooks.forEach((b) => {
      const cls = b.class_name || "General";
      if (!map[cls]) map[cls] = [];
      map[cls].push({
        id: b.id,
        subject: b.subject,
        title: b.book_title || "Prescribed Book",
      });
    });

    const groups: ClassBookGroup[] = Object.entries(map).map(([clsName, books]) => ({
      className: clsName,
      category: getClassCategory(clsName),
      books,
    }));

    return groups.sort((a, b) => getClassSortWeight(a.className) - getClassSortWeight(b.className));
  }, [dbBooks]);

  // Filter available classes by selected category tab
  const filteredClasses = useMemo(() => {
    if (activeCategory === "All") return classBooksData;
    return classBooksData.filter((item) => item.category === activeCategory);
  }, [activeCategory, classBooksData]);

  // Selected class data object
  const currentClassData = useMemo(() => {
    if (!selectedClass) return null;
    return classBooksData.find((item) => item.className === selectedClass) || null;
  }, [selectedClass, classBooksData]);

  // Filter books inside current selected class by search query
  const displayedBooks = useMemo(() => {
    if (!currentClassData) return [];
    if (!searchQuery.trim()) return currentClassData.books;
    const query = searchQuery.toLowerCase().trim();
    return currentClassData.books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.subject.toLowerCase().includes(query)
    );
  }, [currentClassData, searchQuery]);

  return (
    <Layout>
      <PageHero
        title="Prescribed Book List"
        subtitle="Class-wise textbook directory fetched dynamically from database"
        breadcrumb="Books"
      />

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-secondary/15 text-secondary border border-secondary/30 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Academic Session 2026–2027
              </span>
              <h2 className="section-title">Class Book Directory</h2>
              <div className="gold-underline mx-auto my-3" />
              <p className="section-subtitle">
                Click on any class below to view its complete prescribed book list.
              </p>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground font-semibold">
              Loading Database Prescribed Books...
            </div>
          ) : classBooksData.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3 shadow-md max-w-2xl mx-auto">
              <BookOpen className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="text-xl font-heading font-extrabold text-primary">No Prescribed Books Listed</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No book records were found in the Supabase database. Add books by class in the Admin Panel to display them here dynamically.
              </p>
            </div>
          ) : (
            <>
              {/* VIEW 1: CLASS SELECTION GRID (when no class is selected) */}
              {!selectedClass && (
                <AnimatedSection delay={0.1}>
                  {/* Category Filter Pills */}
                  <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
                    <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-primary" /> Filter Category:
                    </span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 text-xs md:text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
                          activeCategory === cat
                            ? "bg-primary text-primary-foreground shadow-sm scale-105"
                            : "bg-card text-muted-foreground border border-border/60 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Class Cards Grid - 5 per row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
                    {filteredClasses.map((item) => (
                      <div
                        key={item.className}
                        onClick={() => {
                          setSelectedClass(item.className);
                          setSearchQuery("");
                        }}
                        className="bg-card rounded-2xl border border-border/80 p-5 shadow-sm hover:shadow-xl hover:border-primary/60 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-colors mb-4">
                            <Book className="w-6 h-6" />
                          </div>
                          <span className="text-[11px] uppercase tracking-wider font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                            {item.category}
                          </span>
                          <h3 className="font-heading font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                            {item.className}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.books.length} Prescribed Subjects
                          </p>
                        </div>

                        <div className="mt-6 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                          <span>View Book List</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              )}

              {/* VIEW 2: DEDICATED CLASS BOOK LIST PAGE (when a class is selected) */}
              {selectedClass && currentClassData && (
                <AnimatedSection delay={0.1}>
                  <div className="space-y-6">
                    {/* Navigation Back Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card rounded-2xl p-4 md:p-6 border border-border/80 shadow-sm">
                      <button
                        onClick={() => setSelectedClass(null)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-primary hover:text-white text-foreground text-xs md:text-sm font-bold transition-all w-fit shadow-sm"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to All Classes
                      </button>

                      {/* Search Bar inside selected class page */}
                      <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search subject or book..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Main Book Table / Cards Container */}
                    <div className="bg-card rounded-3xl border border-border/80 shadow-xl overflow-hidden">
                      {/* Class Banner Header */}
                      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center shrink-0 shadow-inner">
                            <Book className="w-8 h-8 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
                              {currentClassData.className} Textbooks List
                            </h3>
                            <p className="text-xs md:text-sm text-primary-foreground/80 mt-1">
                              Category: <span className="font-bold text-secondary">{currentClassData.category}</span> | Total Prescribed Books: {currentClassData.books.length}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-white/90 font-medium self-start sm:self-auto">
                          Session 2026–2027
                        </div>
                      </div>

                      {/* Book List Content */}
                      {displayedBooks.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                          <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                          <p className="text-lg font-medium text-foreground">No books matching "{searchQuery}"</p>
                          <p className="text-sm mt-1">Try clearing your search query.</p>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 btn-secondary text-xs px-4 py-2 rounded-full"
                          >
                            Clear Search Filter
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Desktop Table View (Clean 3 columns: #, Subject, Book Title) */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-muted/60 text-xs font-bold text-muted-foreground uppercase border-b border-border">
                                  <th className="py-4 px-6 w-16 text-center">#</th>
                                  <th className="py-4 px-6 w-1/3">Subject</th>
                                  <th className="py-4 px-6">Book Title / Prescribed Book</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60 text-sm">
                                {displayedBooks.map((book, idx) => (
                                  <tr
                                    key={book.id}
                                    className="hover:bg-primary/5 transition-colors group"
                                  >
                                    <td className="py-4 px-6 text-center font-mono text-xs text-muted-foreground font-bold">
                                      {idx + 1}
                                    </td>
                                    <td className="py-4 px-6 font-bold text-primary">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                                        {book.subject}
                                      </div>
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {book.title || "Prescribed Textbook"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Card List View */}
                          <div className="md:hidden divide-y divide-border">
                            {displayedBooks.map((book, idx) => (
                              <div key={book.id} className="p-4 space-y-2 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                    #{idx + 1} {book.subject}
                                  </span>
                                </div>
                                <h4 className="font-heading font-semibold text-base text-foreground leading-snug">
                                  {book.title || "Prescribed Textbook"}
                                </h4>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Informational Note for Parents */}
                    <div className="bg-amber-500/10 rounded-3xl p-6 md:p-8 border border-amber-500/20">
                      <h4 className="font-heading font-bold text-foreground text-base mb-2">
                        Important Note for Parents & Students
                      </h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-foreground/80">
                        <li>Book list as per government order is as above.</li>
                        <li>Books as per optional list will be used in classroom for additional learning.</li>
                        <li>Parents are free to buy or not to buy books as per list.</li>
                        <li>Parents are free to buy books from any shop of their choice.</li>
                      </ul>
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Books;
