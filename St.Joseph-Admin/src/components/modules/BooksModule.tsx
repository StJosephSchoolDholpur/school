import React, { useState } from "react";
import { BookItem } from "../../lib/db";
import { BookOpen, Plus, Trash2, Search, Filter } from "lucide-react";

interface BooksModuleProps {
  books: BookItem[];
  onSaveBook: (book: Omit<BookItem, "id"> & { id?: string }) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
}

export const BooksModule: React.FC<BooksModuleProps> = ({ books, onSaveBook, onDeleteBook }) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    class_name: "Class X",
    subject: "Mathematics",
    book_title: "",
    publisher: "NCERT"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.book_title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveBook({
        class_name: form.class_name.trim(),
        subject: form.subject.trim(),
        book_title: form.book_title.trim(),
        publisher: form.publisher.trim() || "NCERT / Standard"
      });
      setForm({ class_name: form.class_name, subject: "Science", book_title: "", publisher: "NCERT" });
    } catch (err) {
      console.error("Save book error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBooks = books.filter((b) => {
    const cls = b.class_name || (b as any).class || (b as any).className || "";
    const title = b.book_title || (b as any).title || (b as any).name || "";
    const subj = b.subject || "";

    const matchesClass = selectedClassFilter === "All" || cls.toLowerCase().includes(selectedClassFilter.toLowerCase());
    const matchesSearch =
      searchQuery === "" ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subj.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" /> Prescribed Books & Textbooks List
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage class-wise NCERT & reference textbooks displayed on the school website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search book title, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none w-60"
            />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs">
            Total Books: {books.length} Records
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Add Book */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Add Book to List
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Class Name *</label>
              <input
                type="text"
                placeholder="e.g. Class X or Class Nursery *"
                value={form.class_name}
                onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">Subject *</label>
              <input
                type="text"
                placeholder="e.g. Mathematics or Science *"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">Book Title *</label>
              <input
                type="text"
                placeholder="e.g. NCERT Mathematics Part I *"
                value={form.book_title}
                onChange={(e) => setForm({ ...form, book_title: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">Publisher</label>
              <input
                type="text"
                placeholder="e.g. NCERT"
                value={form.publisher}
                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Saving..." : "Add Book to Database"}</span>
            </button>
          </div>
        </form>

        {/* Books List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Prescribed Books Directory
            </h3>

            {/* Class Filter */}
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-amber-400 text-xs font-bold rounded-xl px-3 py-1.5 focus:border-amber-400 focus:outline-none"
            >
              <option value="All">All Classes</option>
              {[
                "Class Nursery", "Class LKG", "Class UKG", "Class I", "Class II", "Class III",
                "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X",
                "Class XI", "Class XII"
              ].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Books Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Add prescribed textbooks using the form on the left to show them here and on the main website.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Book Title</th>
                    <th className="py-3 px-3">Publisher</th>
                    <th className="py-3 px-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredBooks.map((b) => {
                    const cls = b.class_name || (b as any).class || (b as any).className || "Class X";
                    const title = b.book_title || (b as any).title || (b as any).name || "Textbook";
                    const subj = b.subject || "General";
                    const pub = b.publisher || "NCERT / Standard";

                    return (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-amber-400">{cls}</td>
                        <td className="py-3 px-3 font-medium text-slate-300">{subj}</td>
                        <td className="py-3 px-3 font-extrabold text-white">{title}</td>
                        <td className="py-3 px-3 text-slate-400">{pub}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete book "${title}" for ${cls}?`)) {
                                onDeleteBook(b.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
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
  );
};
