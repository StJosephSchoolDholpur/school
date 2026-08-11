import React, { useState } from "react";
import { GalleryItem } from "../../lib/db";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";

interface GalleryModuleProps {
  photos: GalleryItem[];
  onSavePhoto: (photo: Omit<GalleryItem, "id"> & { id?: string }) => Promise<void>;
  onDeletePhoto: (id: string) => Promise<void>;
}

export const GalleryModule: React.FC<GalleryModuleProps> = ({ photos, onSavePhoto, onDeletePhoto }) => {
  const [form, setForm] = useState({
    title: "",
    category: "Campus Life",
    image_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image_url) return;
    await onSavePhoto(form);
    setForm({ title: "", category: "Campus Life", image_url: "" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-amber-400" /> School Campus Photo Gallery Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload high-definition photos of labs, smart classrooms, sports ground, and school celebrations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Upload New Photo
          </h3>
          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Caption / Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <input
              type="url"
              placeholder="Image URL *"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Photo</span>
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group relative">
              <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" />
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">{p.title}</h4>
                  <span className="text-[10px] text-slate-500">{p.category}</span>
                </div>
                <button onClick={() => onDeletePhoto(p.id)} className="text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
