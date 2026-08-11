import React, { useState, useMemo } from "react";
import { BookItem } from "../../lib/db";
import { BookOpen, Plus, Trash2, Search, ArrowRight, BookMarked, Sparkles } from "lucide-react";

interface BooksModuleProps {
  books: BookItem[];
  onSaveBook: (book: Omit<BookItem, "id"> & { id?: string }) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
}

const ALL_CLASSES = [
  "Class Nursery",
  "Class LKG",
  "Class UKG",
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
  "Class X",
  "Class XI (Science)",
  "Class XI (Commerce)",
  "Class XI (Arts)",
  "Class XII (Science)",
  "Class XII (Commerce)",
  "Class XII (Arts)"
];

// Smart Class Normalization Helper to match "Class 10", "Class X", "10th", "Class X-A"
const normalizeClassKey = (clsName: string): string => {
  if (!clsName) return "";
  let clean = clsName.toLowerCase().replace(/class/g, "").replace(/\s+/g, "").trim();

  // Strip section suffixes e.g. -a, -b
  clean = clean.replace(/[-_][a-z0-9]/g, "");

  // Strip stream parentheses e.g. (science), (commerce), (arts)
  clean = clean.replace(/\(science\)/g, "").replace(/\(commerce\)/g, "").replace(/\(arts\)/g, "");

  const romanMap: Record<string, string> = {
    "nursery": "nursery",
    "lkg": "lkg",
    "ukg": "ukg",
    "i": "1",
    "ii": "2",
    "iii": "3",
    "iv": "4",
    "v": "5",
    "vi": "6",
    "vii": "7",
    "viii": "8",
    "ix": "9",
    "x": "10",
    "xi": "11",
    "xii": "12"
  };

  if (romanMap[clean]) return romanMap[clean];
  return clean.replace(/st|nd|rd|th/g, "");
};

const isSameClass = (clsA: string, clsB: string): boolean => {
  const normA = normalizeClassKey(clsA);
  const normB = normalizeClassKey(clsB);
  if (normA && normB && normA === normB) return true;
  return clsA.toLowerCase().trim() === clsB.toLowerCase().trim();
};

export const BooksModule: React.FC<BooksModuleProps> = ({ books, onSaveBook, onDeleteBook }) => {
  const [selectedClass, setSelectedClass] = useState<string>("Class X");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [form, setForm] = useState({
    subject: "Mathematics",
    book_title: "",
    publisher: "NCERT"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map books count per class using smart class matching
  const classBookCounts = useMemo(() => {
    const map: Record<string, number> = {};
    ALL_CLASSES.forEach((c) => {
      map[c] = books.filter((b) => {
        const cls = b.class_name || (b as any).class || (b as any).className || "";
        return isSameClass(cls, c);
      }).length;
    });

    return map;
  }, [books]);

  // Filter books for current selected class
  const currentClassBooks = useMemo(() => {
    return books.filter((b) => {
      const cls = b.class_name || (b as any).class || (b as any).className || "";
      const title = b.book_title || (b as any).title || (b as any).name || "";
      const subj = b.subject || "";

      const matchesClass = isSameClass(cls, selectedClass);
      const matchesSearch =
        searchQuery === "" ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subj.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesClass && matchesSearch;
    });
  }, [books, selectedClass, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.book_title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveBook({
        class_name: selectedClass,
        subject: form.subject.trim(),
        book_title: form.book_title.trim(),
        publisher: form.publisher.trim() || "NCERT / Standard"
      });
      setForm({ subject: "Science", book_title: "", publisher: "NCERT" });
      setIsAddingNew(false);
    } catch (err) {
      console.error("Save book error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" /> Prescribed Books & Textbooks List
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select a class from the left sidebar to view and manage prescribed NCERT textbooks for that specific class.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs">
            Total Books in Database: {books.length} Records
          </div>
        </div>
      </div>

      {/* Two-Pane Class Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Class List Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 lg:col-span-1 max-h-[75vh] overflow-y-auto">
          <div className="px-2 py-1 border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-amber-400" /> Select Class
            </h3>
            <span className="text-[10px] font-bold text-slate-500">{ALL_CLASSES.length} Classes</span>
          </div>

          <div className="space-y-1.5">
            {ALL_CLASSES.map((cls) => {
              const count = classBookCounts[cls] || 0;
              const isSelected = selectedClass === cls;

              return (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClass(cls);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-lg scale-[1.02]"
                      : "bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📚</span>
                    <span>{cls}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-slate-950 text-amber-400" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {count} Books
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-slate-950" : "text-slate-600"}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Class Book List & Add Form */}
        <div className="lg:col-span-3 space-y-5">
          {/* Class Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full uppercase">
                  Class Book List
                </span>
              </div>
              <h3 className="text-xl font-heading font-extrabold text-white mt-1">
                {selectedClass} — Textbooks Directory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Displaying {currentClassBooks.length} prescribed books for {selectedClass}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter subject/title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none w-44"
                />
              </div>

              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingNew ? "Close Form" : `+ Add Book to ${selectedClass}`}</span>
              </button>
            </div>
          </div>

          {/* Add Book Form Collapsible Card */}
          {isAddingNew && (
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 animate-fadeIn"
            >
              <h4 className="font-extrabold text-xs text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Register New Book for {selectedClass}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Subject (e.g. Science) *"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Book Title (e.g. NCERT Science Part I) *"
                  value={form.book_title}
                  onChange={(e) => setForm({ ...form, book_title: e.target.value })}
                  required
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Publisher (e.g. NCERT)"
                  value={form.publisher}
                  onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? "Saving Book..." : `Save Book to ${selectedClass}`}</span>
              </button>
            </form>
          )}

          {/* Table of Books for Selected Class */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {currentClassBooks.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No Prescribed Books Registered for {selectedClass}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "+ Add Book to {selectedClass}" above to populate textbooks for this class.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-4 px-4">Subject</th>
                      <th className="py-4 px-4">Book Title</th>
                      <th className="py-4 px-4">Publisher</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {currentClassBooks.map((b) => {
                      const title = b.book_title || (b as any).title || (b as any).name || "Textbook";
                      const subj = b.subject || "General";
                      const pub = b.publisher || "NCERT / Standard";

                      return (
                        <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4 font-bold text-amber-400">{subj}</td>
                          <td className="py-4 px-4 font-extrabold text-white text-sm">{title}</td>
                          <td className="py-4 px-4 text-slate-400 font-medium">{pub}</td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Delete book "${title}" from ${selectedClass}?`)) {
                                  onDeleteBook(b.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-400 bg-slate-950 rounded-xl border border-slate-800 transition-all"
                              title="Delete Book Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
