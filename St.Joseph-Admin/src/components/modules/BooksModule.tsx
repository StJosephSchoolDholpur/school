import React, { useState } from "react";
import { BookItem } from "../../lib/db";
import { BookOpen, Plus, Trash2 } from "lucide-react";

interface BooksModuleProps {
  books: BookItem[];
  onSaveBook: (book: Omit<BookItem, "id"> & { id?: string }) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
}

export const BooksModule: React.FC<BooksModuleProps> = ({ books, onSaveBook, onDeleteBook }) => {
  const [form, setForm] = useState({
    class_name: "Class X",
    subject: "Mathematics",
    book_title: "",
    publisher: "NCERT"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.book_title) return;
    await onSaveBook(form);
    setForm({ class_name: "Class X", subject: "Mathematics", book_title: "", publisher: "NCERT" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" /> Recommended Book List Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage class-wise prescribed NCERT and reference textbook lists for academic sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Add Book to List
          </h3>
          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Class Name (e.g. Class X) *"
              value={form.class_name}
              onChange={(e) => setForm({ ...form, class_name: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <input
              type="text"
              placeholder="Subject (e.g. Science) *"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <input
              type="text"
              placeholder="Book Title *"
              value={form.book_title}
              onChange={(e) => setForm({ ...form, book_title: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <input
              type="text"
              placeholder="Publisher (e.g. NCERT)"
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book</span>
            </button>
          </div>
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">Publisher</th>
                  <th className="py-3 px-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-amber-400">{b.class_name}</td>
                    <td className="py-3 px-3">{b.subject}</td>
                    <td className="py-3 px-3 font-extrabold text-white">{b.book_title}</td>
                    <td className="py-3 px-3 text-slate-400">{b.publisher}</td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => onDeleteBook(b.id)} className="text-slate-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
