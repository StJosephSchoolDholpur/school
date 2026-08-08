import React, { useState, useEffect, useMemo } from "react";
import { Sidebar, AdminTab } from "../components/Sidebar";
import { WhatsAppBirthdayManager } from "../components/WhatsAppBirthdayManager";
import {
  fetchTCs,
  uploadAndSaveTC,
  deleteTCRecord,
  fetchTeachers,
  saveTeacherRecord,
  deleteTeacherRecord,
  fetchStudents,
  saveStudentRecord,
  deleteStudentRecord,
  fetchFeeStructure,
  saveFeeStructure,
  fetchTransportRoutes,
  saveTransportRoute,
  deleteTransportRoute,
  fetchMandatoryDocs,
  saveMandatoryDoc,
  deleteMandatoryDoc,
  fetchNews,
  saveNews,
  deleteNews,
  fetchEvents,
  saveEvent,
  deleteEvent,
  fetchBooks,
  saveBook,
  deleteBook,
  fetchAchievements,
  saveAchievement,
  deleteAchievement,
  fetchGallery,
  saveGallery,
  deleteGallery,
  fetchCalendar,
  saveCalendar,
  deleteCalendar,
  SUPABASE_ANON_KEY,
  TCRecordData,
  Teacher,
  Student,
  FeeSection,
  TransportRoute,
  MandatoryDoc,
  NewsItem,
  EventItem,
  BookItem,
  AchievementItem,
  GalleryItem,
  CalendarEvent
} from "../lib/db";
import {
  FileCheck2,
  Users,
  GraduationCap,
  IndianRupee,
  Bus,
  ShieldCheck,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Calendar as CalendarIcon,
  Eye,
  RefreshCw,
  Newspaper,
  BookOpen,
  Trophy,
  Image as ImageIcon
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // State Stores
  const [tcs, setTcs] = useState<TCRecordData[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<FeeSection[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [mandatoryDocs, setMandatoryDocs] = useState<MandatoryDoc[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [booksList, setBooksList] = useState<BookItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tcSelectedClass, setTcSelectedClass] = useState<string>("All");
  const [selectedBookClassModal, setSelectedBookClassModal] = useState<string | null>(null);
  const [selectedTcClassModal, setSelectedTcClassModal] = useState<string | null>(null);
  const [selectedStudentClassModal, setSelectedStudentClassModal] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tcData, tData, sData, fData, rData, mdData, nData, evData, bData, achData, gData, calData] = await Promise.all([
        fetchTCs(),
        fetchTeachers(),
        fetchStudents(),
        fetchFeeStructure(),
        fetchTransportRoutes(),
        fetchMandatoryDocs(),
        fetchNews(),
        fetchEvents(),
        fetchBooks(),
        fetchAchievements(),
        fetchGallery(),
        fetchCalendar(),
      ]);
      setTcs(tcData);
      setTeachers(tData);
      setStudents(sData);
      setFees(fData);
      setRoutes(rData);
      setMandatoryDocs(mdData);
      setNews(nData);
      setEventsList(evData);
      setBooksList(bData);
      setAchievements(achData);
      setGalleryPhotos(gData);
      setCalendarEvents(calData);
    } catch (e) {
      console.error("Load dashboard data error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. TC STATE
  const [tcSearch, setTcSearch] = useState("");
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [uploadingTc, setUploadingTc] = useState(false);
  const [newTc, setNewTc] = useState({
    roll_no: "",
    class: "",
    student_name: "",
    father_name: "",
    dob: "",
    tc_number: "",
    issue_date: "",
    file_url: "",
  });

  // 2. TEACHER STATE
  const [newTeacher, setNewTeacher] = useState({ name: "", designation: "", department: "", dob: "", wishes: "" });

  // 3. STUDENT STATE
  const [newStudent, setNewStudent] = useState({ name: "", class: "", dob: "", wishes: "" });

  // 4. ROUTE STATE
  const [newRoute, setNewRoute] = useState({ area: "", busNo: "", stops: "", pickupTime: "07:00 AM", driverName: "", driverPhone: "" });

  // 5. MANDATORY DOC STATE
  const [newDoc, setNewDoc] = useState({ title: "", category: "CBSE Affiliation", file_url: "", file_type: "pdf" as "pdf" | "image" });

  // 6. NEWS STATE
  const [newNews, setNewNews] = useState({ title: "", category: "Announcement", summary: "", date: "" });

  // 7. EVENTS STATE
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "09:00 AM - 12:30 PM",
    location: "Main Auditorium & Grounds",
    category: "Celebration",
    status: "Upcoming",
    shortDesc: "",
    fullDesc: "",
    chiefGuest: "",
    targetAudience: "Students, Staff & Parents",
  });

  // 8. BOOKS STATE
  const [newBook, setNewBook] = useState({ class_name: "Class I", subject: "", book_title: "", publisher: "NCERT / Standard" });

  // 9. ACHIEVEMENTS STATE
  const [newAchievement, setNewAchievement] = useState({ title: "", category: "Excellence", year: "2026", description: "" });

  // 10. GALLERY STATE
  const [newGallery, setNewGallery] = useState({ title: "", category: "Campus", image_url: "" });
  const [bulkGalleryFiles, setBulkGalleryFiles] = useState<File[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // 11. CALENDAR STATE
  const [newCalEvent, setNewCalEvent] = useState({ title: "", date: "", category: "Academic", description: "" });

  // HANDLERS
  const handleAddTC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTc.student_name || !newTc.tc_number) return alert("Fill required TC fields!");
    setUploadingTc(true);
    try {
      const saved = await uploadAndSaveTC(selectedPdfFile, newTc);
      setTcs([saved, ...tcs]);
      setNewTc({ roll_no: "", class: "", student_name: "", father_name: "", dob: "", tc_number: "", issue_date: "", file_url: "" });
      setSelectedPdfFile(null);
      alert("TC Record uploaded & saved dynamically!");
    } catch (e) {
      alert("Error saving TC");
    } finally {
      setUploadingTc(false);
    }
  };

  const handleDeleteTC = async (id: string) => {
    if (!confirm("Delete TC record?")) return;
    await deleteTCRecord(id);
    setTcs(tcs.filter((t) => t.id !== id));
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.dob) return alert("Fill teacher name & DOB!");
    const saved = await saveTeacherRecord(newTeacher);
    setTeachers([saved, ...teachers]);
    setNewTeacher({ name: "", designation: "", department: "", dob: "", wishes: "" });
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("Delete teacher record?")) return;
    await deleteTeacherRecord(id);
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.dob) return alert("Fill student name & DOB!");
    const saved = await saveStudentRecord(newStudent);
    setStudents([saved, ...students]);
    setNewStudent({ name: "", class: "", dob: "", wishes: "" });
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Delete student record?")) return;
    await deleteStudentRecord(id);
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoute.area || !newRoute.busNo) return alert("Fill area and bus number!");
    const saved = await saveTransportRoute({ ...newRoute, status: "active" });
    setRoutes([saved, ...routes]);
    setNewRoute({ area: "", busNo: "", stops: "", pickupTime: "07:00 AM", driverName: "", driverPhone: "" });
  };

  const handleDeleteRoute = async (id: string) => {
    if (!confirm("Delete bus route?")) return;
    await deleteTransportRoute(id);
    setRoutes(routes.filter((r) => r.id !== id));
  };

  const handleAddMandatoryDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.file_url) return alert("Provide title and document URL / file!");
    const saved = await saveMandatoryDoc(newDoc);
    setMandatoryDocs([saved, ...mandatoryDocs]);
    setNewDoc({ title: "", category: "CBSE Affiliation", file_url: "", file_type: "pdf" });
  };

  const handleDeleteMandatoryDoc = async (id: string) => {
    if (!confirm("Delete disclosure document?")) return;
    await deleteMandatoryDoc(id);
    setMandatoryDocs(mandatoryDocs.filter((d) => d.id !== id));
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title) return alert("Provide news title!");
    const saved = await saveNews(newNews);
    setNews([saved, ...news]);
    setNewNews({ title: "", category: "Announcement", summary: "", date: "" });
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Delete news item?")) return;
    await deleteNews(id);
    setNews(news.filter((n) => n.id !== id));
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return alert("Provide event title & date!");
    const saved = await saveEvent(newEvent);
    setEventsList([saved, ...eventsList]);
    setNewEvent({
      title: "",
      date: "",
      time: "09:00 AM - 12:30 PM",
      location: "Main Auditorium & Grounds",
      category: "Celebration",
      status: "Upcoming",
      shortDesc: "",
      fullDesc: "",
      chiefGuest: "",
      targetAudience: "Students, Staff & Parents",
    });
    alert("School Event created and saved dynamically!");
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete event?")) return;
    await deleteEvent(id);
    setEventsList(eventsList.filter((ev) => ev.id !== id));
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.subject || !newBook.book_title) return alert("Provide subject and book title!");
    const saved = await saveBook(newBook);
    setBooksList([saved, ...booksList]);
    setNewBook({ class_name: "Class I", subject: "", book_title: "", publisher: "NCERT / Standard" });
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Delete book?")) return;
    await deleteBook(id);
    setBooksList(booksList.filter((b) => b.id !== id));
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.title) return alert("Provide title!");
    const saved = await saveAchievement(newAchievement);
    setAchievements([saved, ...achievements]);
    setNewAchievement({ title: "", category: "Excellence", year: "2026", description: "" });
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm("Delete achievement?")) return;
    await deleteAchievement(id);
    setAchievements(achievements.filter((a) => a.id !== id));
  };

  // Instant Image Compression helper (reduces 5MB photo to ~90KB JPEG)
  const compressImageFile = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(compressedDataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = (err) => reject(err);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bulkGalleryFiles.length > 0) {
      setUploadingGallery(true);
      try {
        const savedItems = [];
        const baseTitle = newGallery.title.trim() || "Campus Photo";
        const cat = newGallery.category.trim() || "Campus";

        for (let i = 0; i < bulkGalleryFiles.length; i++) {
          const file = bulkGalleryFiles[i];
          const dataUrl = await compressImageFile(file);
          const itemTitle = bulkGalleryFiles.length > 1 ? `${baseTitle} #${i + 1}` : baseTitle;
          const saved = await saveGallery({
            title: itemTitle,
            category: cat,
            image_url: dataUrl
          });
          savedItems.unshift(saved);
        }

        setGalleryPhotos((prev) => [...savedItems, ...prev]);
        setNewGallery({ title: "", category: "Campus", image_url: "" });
        setBulkGalleryFiles([]);
        alert(`Successfully uploaded & saved ${savedItems.length} gallery photos!`);
      } catch (err) {
        console.error("Bulk gallery upload error", err);
        alert("Error processing bulk photos");
      } finally {
        setUploadingGallery(false);
      }
      return;
    }

    if (!newGallery.title || !newGallery.image_url) {
      return alert("Please select photos from your computer or enter an image URL!");
    }

    setUploadingGallery(true);
    try {
      const saved = await saveGallery(newGallery);
      setGalleryPhotos((prev) => [saved, ...prev]);
      setNewGallery({ title: "", category: "Campus", image_url: "" });
      alert("Gallery photo saved successfully!");
    } catch (e) {
      alert("Error saving gallery photo");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete photo?")) return;
    await deleteGallery(id);
    setGalleryPhotos(galleryPhotos.filter((g) => g.id !== id));
  };

  const handleAddCalEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalEvent.title || !newCalEvent.date) return alert("Provide title and date!");
    const saved = await saveCalendar(newCalEvent);
    setCalendarEvents([saved, ...calendarEvents]);
    setNewCalEvent({ title: "", date: "", category: "Academic", description: "" });
  };

  const handleDeleteCalEvent = async (id: string) => {
    if (!confirm("Delete calendar entry?")) return;
    await deleteCalendar(id);
    setCalendarEvents(calendarEvents.filter((c) => c.id !== id));
  };

  const handleAddFeeSection = () => {
    const title = prompt("Enter Fee Section Title (e.g., Primary (Class 1st to 5th)):");
    if (!title) return;
    const total = prompt("Enter Yearly Total Fee (e.g., 27,000):") || "0";
    const admissionPay = prompt("Enter Approx Admission Pay (e.g., 12,500):") || "0";

    const newSec: FeeSection = {
      id: `fee_${Date.now()}`,
      title,
      total,
      admissionPay,
      data: [
        { label: "Tuition Fee", amount: "1000" },
        { label: "Exam Fee", amount: "500" },
      ],
    };
    setFees([...fees, newSec]);
  };

  const handleAddFeeItem = (secIdx: number) => {
    const label = prompt("Enter Fee Particular (e.g., Exam Fee):");
    if (!label) return;
    const amount = prompt("Enter Amount (₹):") || "0";

    const copy = [...fees];
    copy[secIdx].data.push({ label, amount });
    setFees(copy);
  };

  const handleDeleteFeeSection = (secIdx: number) => {
    if (!confirm("Delete this entire fee section?")) return;
    const copy = fees.filter((_, idx) => idx !== secIdx);
    setFees(copy);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              Admin Portal
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-white capitalize">
              {activeTab === "tc" ? "Transfer Certificate Manager" : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {SUPABASE_ANON_KEY ? (
              <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] rounded-xl flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Supabase Connected
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] rounded-xl flex items-center gap-1.5" title="Add VITE_SUPABASE_ANON_KEY to environment variables to connect to Supabase Cloud Database">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Local Storage Mode
              </span>
            )}
            <button
              onClick={loadData}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} /> Refresh Sync
            </button>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-400 transition-colors"
            >
              Open Main Website <Eye className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "TC Certificates", count: tcs.length, icon: FileCheck2 },
                { label: "Teachers & Staff", count: teachers.length, icon: GraduationCap },
                { label: "Registered Students", count: students.length, icon: Users },
                { label: "Bus Routes", count: routes.length, icon: Bus },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">{stat.label}</p>
                    <p className="text-2xl font-heading font-extrabold text-white mt-1">{stat.count}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 2: TC MANAGER ─── */}
        {activeTab === "tc" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" /> Issue & Upload Transfer Certificate (TC)
              </h3>
              <form onSubmit={handleAddTC} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Student Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={newTc.student_name}
                    onChange={(e) => setNewTc({ ...newTc, student_name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Father's Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajendra Sharma"
                    value={newTc.father_name}
                    onChange={(e) => setNewTc({ ...newTc, father_name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Class / Grade *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10"
                    value={newTc.class}
                    onChange={(e) => setNewTc({ ...newTc, class: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">SR / Roll No. *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1001"
                    value={newTc.roll_no}
                    onChange={(e) => setNewTc({ ...newTc, roll_no: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">TC Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. TC-2026-001"
                    value={newTc.tc_number}
                    onChange={(e) => setNewTc({ ...newTc, tc_number: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Issue Date *</label>
                  <input
                    type="date"
                    value={newTc.issue_date}
                    onChange={(e) => setNewTc({ ...newTc, issue_date: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-slate-400 font-bold mb-1">Attach Signed TC Document PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedPdfFile(e.target.files?.[0] || null)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" disabled={uploadingTc} className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    {uploadingTc ? "Uploading & Saving..." : "Save & Upload TC"}
                  </button>
                </div>
              </form>
            </div>

            {/* CLASS WISE TC CARDS GRID */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-white text-base">
                Class-Wise Transfer Certificates ({Object.keys(
                  tcs.reduce((acc: any, t) => {
                    const cls = t.class ? `Class ${t.class}` : "General";
                    acc[cls] = true;
                    return acc;
                  }, {})
                ).length} Classes)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Object.entries(
                  tcs.reduce((acc: Record<string, TCRecordData[]>, t) => {
                    const cls = t.class ? (t.class.toLowerCase().includes("class") ? t.class : `Class ${t.class}`) : "General";
                    if (!acc[cls]) acc[cls] = [];
                    acc[cls].push(t);
                    return acc;
                  }, {})
                )
                  .sort(([a], [b]) => {
                    const getWeight = (s: string) => {
                      const l = s.toLowerCase();
                      if (l.includes("nursery")) return -3;
                      if (l.includes("lkg")) return -2;
                      if (l.includes("ukg")) return -1;
                      const m = s.match(/\d+/);
                      return m ? parseInt(m[0], 10) : 99;
                    };
                    return getWeight(a) - getWeight(b);
                  })
                  .map(([clsName, tcList]) => (
                    <div
                      key={clsName}
                      onClick={() => setSelectedTcClassModal(clsName)}
                      className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                            <FileCheck2 className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            {tcList.length} {tcList.length === 1 ? "TC" : "TCs"} Issued
                          </span>
                        </div>

                        <div>
                          <h4 className="font-heading font-extrabold text-white text-lg group-hover:text-amber-400 transition-colors">
                            {clsName}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Issued Transfer Certificates Directory
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                        <span>Click to View TCs</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* CLASS TC MODAL DIALOG */}
            {selectedTcClassModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-bold text-white">
                          {selectedTcClassModal} Issued Transfer Certificates
                        </h3>
                        <p className="text-xs text-slate-400">Complete student TC directory for this class.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTcClassModal(null)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* TC Records List inside Modal */}
                  <div className="space-y-3">
                    {tcs.filter(t => {
                      const cls = t.class ? (t.class.toLowerCase().includes("class") ? t.class : `Class ${t.class}`) : "General";
                      return cls === selectedTcClassModal;
                    }).length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">No TC certificates issued for {selectedTcClassModal} yet.</div>
                    ) : (
                      <div className="grid gap-3">
                        {tcs
                          .filter(t => {
                            const cls = t.class ? (t.class.toLowerCase().includes("class") ? t.class : `Class ${t.class}`) : "General";
                            return cls === selectedTcClassModal;
                          })
                          .map((t) => (
                            <div key={t.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-all">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-white text-sm">{t.student_name}</h4>
                                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    Roll / SR: {t.roll_no}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400">Father's Name: <span className="text-slate-300 font-medium">{t.father_name || "N/A"}</span></p>
                                <p className="text-[11px] text-slate-500 flex items-center gap-3">
                                  <span>TC No: <strong className="text-emerald-400 font-mono">{t.tc_number}</strong></span>
                                  <span>•</span>
                                  <span>Issued: {t.issue_date || "N/A"}</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {((t as any).tc_url || (t as any).pdf_url) && (
                                  <a
                                    href={(t as any).tc_url || (t as any).pdf_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                    title="View / Download TC PDF"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> PDF
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteTC(t.id)}
                                  className="p-2 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-xl transition-all"
                                  title="Delete TC Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: TEACHERS & BIRTHDAYS ─── */}
        {activeTab === "teachers" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" /> Add Teacher & Set Birthday
              </h3>
              <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Teacher Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Praveen Tyagi"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Designation *</label>
                  <input
                    type="text"
                    placeholder="e.g. PGT Mathematics"
                    value={newTeacher.designation}
                    onChange={(e) => setNewTeacher({ ...newTeacher, designation: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Date of Birth (DOB) *</label>
                  <input
                    type="date"
                    value={newTeacher.dob}
                    onChange={(e) => setNewTeacher({ ...newTeacher, dob: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Save Teacher Record
                  </button>
                </div>
              </form>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {teachers.map((t) => (
                <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative">
                  <button onClick={() => handleDeleteTeacher(t.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-amber-400">{t.designation}</p>
                  <p className="text-xs text-slate-400">DOB: {t.dob}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: STUDENTS & BIRTHDAYS ─── */}
        {activeTab === "students" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" /> Add Student & Set Birthday
              </h3>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Class *</label>
                  <input
                    type="text"
                    placeholder="e.g. Class X-A"
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Date of Birth (DOB) *</label>
                  <input
                    type="date"
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Save Student Record
                  </button>
                </div>
              </form>
            </div>

            {/* CLASS WISE STUDENT CARDS GRID */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-white text-base">
                Class-Wise Student Directory ({Object.keys(
                  students.reduce((acc: any, s) => {
                    const cls = s.class ? (s.class.toLowerCase().includes("class") ? s.class : `Class ${s.class}`) : "General";
                    acc[cls] = true;
                    return acc;
                  }, {})
                ).length} Classes)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Object.entries(
                  students.reduce((acc: Record<string, Student[]>, s) => {
                    const rawCls = s.class || "General";
                    const cls = rawCls.toLowerCase().includes("class") ? rawCls : `Class ${rawCls}`;
                    if (!acc[cls]) acc[cls] = [];
                    acc[cls].push(s);
                    return acc;
                  }, {})
                )
                  .sort(([a], [b]) => {
                    const getWeight = (str: string) => {
                      const l = str.toLowerCase();
                      if (l.includes("nursery")) return -3;
                      if (l.includes("lkg")) return -2;
                      if (l.includes("ukg")) return -1;
                      const m = str.match(/\d+/);
                      return m ? parseInt(m[0], 10) : 99;
                    };
                    return getWeight(a) - getWeight(b);
                  })
                  .map(([clsName, studentList]) => (
                    <div
                      key={clsName}
                      onClick={() => setSelectedStudentClassModal(clsName)}
                      className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                            <Users className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            {studentList.length} {studentList.length === 1 ? "Student" : "Students"}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-heading font-extrabold text-white text-lg group-hover:text-amber-400 transition-colors">
                            {clsName}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Active Student Roster
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                        <span>Click to View Students</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* CLASS STUDENT MODAL DIALOG */}
            {selectedStudentClassModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-bold text-white">
                          {selectedStudentClassModal} Student Roster
                        </h3>
                        <p className="text-xs text-slate-400">Complete student directory & birthday records.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudentClassModal(null)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* Add Student Quick Form */}
                  <form onSubmit={handleAddStudent} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <h4 className="font-bold text-amber-400">Add New Student to {selectedStudentClassModal}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Student Full Name *"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, class: selectedStudentClassModal, name: e.target.value })}
                        required
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
                      />
                      <input
                        type="date"
                        value={newStudent.dob}
                        onChange={(e) => setNewStudent({ ...newStudent, class: selectedStudentClassModal, dob: e.target.value })}
                        required
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
                      />
                      <button type="submit" className="py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs">
                        + Save Student
                      </button>
                    </div>
                  </form>

                  {/* Student List inside Modal */}
                  <div className="space-y-3">
                    {students.filter(s => {
                      const rawCls = s.class || "General";
                      const cls = rawCls.toLowerCase().includes("class") ? rawCls : `Class ${rawCls}`;
                      return cls === selectedStudentClassModal;
                    }).length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">No registered students in {selectedStudentClassModal} yet.</div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-3">
                        {students
                          .filter(s => {
                            const rawCls = s.class || "General";
                            const cls = rawCls.toLowerCase().includes("class") ? rawCls : `Class ${rawCls}`;
                            return cls === selectedStudentClassModal;
                          })
                          .map((s) => (
                            <div key={s.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all">
                              <div className="space-y-1">
                                <h4 className="font-bold text-white text-sm">{s.name}</h4>
                                <p className="text-xs text-amber-400">DOB: <span className="font-mono">{s.dob || "N/A"}</span></p>
                                <p className="text-[11px] text-slate-400">Class: {s.class}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteStudent(s.id)}
                                className="p-2 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-xl transition-all shrink-0"
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 5: FEES STRUCTURE ─── */}
        {activeTab === "fees" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-amber-400" /> Dynamic Fee Structure Editor
                </h3>
                <button
                  type="button"
                  onClick={handleAddFeeSection}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Fee Section
                </button>
              </div>

              <div className="space-y-6">
                {fees.map((sec, i) => (
                  <div key={sec.id || i} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 relative">
                    <button
                      onClick={() => handleDeleteFeeSection(i)}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 text-[10px] font-bold uppercase">Section Title</label>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const copy = [...fees];
                            copy[i].title = e.target.value;
                            setFees(copy);
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] font-bold uppercase">Yearly Total Fee (₹)</label>
                        <input
                          type="text"
                          value={sec.total}
                          onChange={(e) => {
                            const copy = [...fees];
                            copy[i].total = e.target.value;
                            setFees(copy);
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] font-bold uppercase">Admission Pay Approx (₹)</label>
                        <input
                          type="text"
                          value={sec.admissionPay}
                          onChange={(e) => {
                            const copy = [...fees];
                            copy[i].admissionPay = e.target.value;
                            setFees(copy);
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                        <span>Fee Breakdown Items</span>
                        <button
                          onClick={() => handleAddFeeItem(i)}
                          className="text-amber-400 text-[10px] uppercase underline hover:text-amber-300"
                        >
                          + Add Item
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {sec.data.map((item, j) => (
                          <div key={j} className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800">
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const copy = [...fees];
                                copy[i].data[j].label = e.target.value;
                                setFees(copy);
                              }}
                              className="flex-1 p-1 bg-transparent text-slate-300 text-xs focus:outline-none"
                            />
                            <input
                              type="text"
                              value={item.amount}
                              onChange={(e) => {
                                const copy = [...fees];
                                copy[i].data[j].amount = e.target.value;
                                setFees(copy);
                              }}
                              className="w-20 p-1 bg-transparent text-right font-bold text-white text-xs focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    saveFeeStructure(fees);
                    alert("Fee structure saved dynamically to database!");
                  }}
                  className="w-full py-3.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg"
                >
                  Publish & Save Fee Structure Updates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 6: TRANSPORTATION ─── */}
        {activeTab === "transport" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" /> Add Transportation Bus Route
              </h3>
              <form onSubmit={handleAddRoute} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Route Area *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dholpur City Route"
                    value={newRoute.area}
                    onChange={(e) => setNewRoute({ ...newRoute, area: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Bus Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. RJ-11-PA-101"
                    value={newRoute.busNo}
                    onChange={(e) => setNewRoute({ ...newRoute, busNo: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Pickup Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 07:00 AM"
                    value={newRoute.pickupTime}
                    onChange={(e) => setNewRoute({ ...newRoute, pickupTime: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Key Stops List</label>
                  <input
                    type="text"
                    placeholder="e.g. Gulab Bagh, Ondela Road, Station"
                    value={newRoute.stops}
                    onChange={(e) => setNewRoute({ ...newRoute, stops: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Driver Name & Phone</label>
                  <input
                    type="text"
                    placeholder="Ram Singh (+91 98291-11223)"
                    value={newRoute.driverName}
                    onChange={(e) => setNewRoute({ ...newRoute, driverName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Save Bus Route
                  </button>
                </div>
              </form>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {routes.map((r) => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative">
                  <button onClick={() => handleDeleteRoute(r.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-white text-sm">{r.area}</h4>
                  <p className="text-xs text-amber-400">Bus: {r.busNo} | Pickup: {r.pickupTime}</p>
                  <p className="text-xs text-slate-400">Stops: {r.stops}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 7: MANDATORY DISCLOSURE ─── */}
        {activeTab === "mandatory" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" /> Upload Mandatory Public Disclosure Document
              </h3>
              <form onSubmit={handleAddMandatoryDoc} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Document Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. CBSE Affiliation Extension Letter"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category *</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="CBSE Affiliation">CBSE Affiliation</option>
                    <option value="State NOC">State NOC</option>
                    <option value="Building Safety">Building Safety</option>
                    <option value="Society Registration">Society Registration</option>
                    <option value="Special Educator">Special Educator</option>
                    <option value="Water & Fire Safety">Water & Fire Safety</option>
                    <option value="Governance">Governance (SMC / PTA)</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-slate-400 font-bold mb-1">Document File (Pick from Computer or Enter Link) *</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const url = ev.target?.result as string;
                              setNewDoc((prev) => ({
                                ...prev,
                                file_url: url,
                                file_type: file.type.includes("pdf") ? "pdf" : "image",
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Or enter URL / path..."
                        value={newDoc.file_url}
                        onChange={(e) => setNewDoc({ ...newDoc, file_url: e.target.value })}
                        required
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Save Disclosure Certificate
                  </button>
                </div>
              </form>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {mandatoryDocs.map((doc) => (
                <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative">
                  <button onClick={() => handleDeleteMandatoryDoc(doc.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold text-amber-400 uppercase">{doc.category}</span>
                  <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{doc.file_url}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 8: NEWS & EVENTS ─── */}
        {activeTab === "news" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-amber-400" /> Add News Article & Announcement
              </h3>
              <form onSubmit={handleAddNews} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">News Headline / Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Students Excel in Board Exams"
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Publish Date</label>
                  <input
                    type="text"
                    placeholder="e.g. August 2026"
                    value={newNews.date}
                    onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">News Content / Summary *</label>
                  <textarea
                    placeholder="Write article summary..."
                    value={newNews.summary}
                    onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                    rows={3}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Publish News Article
                  </button>
                </div>
              </form>
            </div>

            {/* Single Row Layout for Published News Articles */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-base">
                Published Articles & Announcements ({news.length})
              </h4>
              {news.map((n) => (
                <div
                  key={n.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-md"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                        {n.category || "News"}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">{n.date}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{n.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{n.summary || n.content}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDeleteNews(n.id)}
                      className="p-2 bg-slate-950 hover:bg-rose-500 hover:text-white text-slate-400 rounded-xl transition-all"
                      title="Delete News Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: SCHOOL EVENTS MANAGER ─── */}
        {activeTab === "events" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" /> Create & Publish School Event
              </h3>
              <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Event Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Investiture Ceremony 2026"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Event Date *</label>
                  <input
                    type="text"
                    placeholder="e.g. May 02, 2026"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Event Timings</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 12:30 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Venue / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Auditorium & Parade Grounds"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Event Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Sports">Sports</option>
                    <option value="Academic">Academic</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Competitions">Competitions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Status</label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Upcoming">Upcoming Event</option>
                    <option value="Recent">Recent Past Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Chief Guest / Guest of Honor</label>
                  <input
                    type="text"
                    placeholder="e.g. School Management Board & Principal"
                    value={newEvent.chiefGuest}
                    onChange={(e) => setNewEvent({ ...newEvent, chiefGuest: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. Student Council, Faculty & Parents"
                    value={newEvent.targetAudience}
                    onChange={(e) => setNewEvent({ ...newEvent, targetAudience: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Short Summary *</label>
                  <input
                    type="text"
                    placeholder="Brief 1-line event summary..."
                    value={newEvent.shortDesc}
                    onChange={(e) => setNewEvent({ ...newEvent, shortDesc: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Full Detailed Description</label>
                  <textarea
                    placeholder="Write detailed event description..."
                    value={newEvent.fullDesc}
                    onChange={(e) => setNewEvent({ ...newEvent, fullDesc: e.target.value })}
                    rows={3}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors">
                    Publish Event Program
                  </button>
                </div>
              </form>
            </div>

            {/* Single Row Layout for Published Events */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-base">
                Published School Events & Programs ({eventsList.length})
              </h4>
              {eventsList.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-md"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                        {ev.category || "Event"}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">{ev.date}</span>
                      {ev.time && <span className="text-[10px] text-slate-500 font-mono">({ev.time})</span>}
                    </div>
                    <h4 className="font-bold text-white text-sm">{ev.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{ev.shortDesc || ev.fullDesc || ev.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-2 bg-slate-950 hover:bg-rose-500 hover:text-white text-slate-400 rounded-xl transition-all"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 9: BOOK LIST ─── */}
        {activeTab === "books" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" /> Add Prescribed Book Record
              </h3>
              <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Class Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Class I"
                    value={newBook.class_name}
                    onChange={(e) => setNewBook({ ...newBook, class_name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Subject *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics"
                    value={newBook.subject}
                    onChange={(e) => setNewBook({ ...newBook, subject: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Book Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Maths Today"
                    value={newBook.book_title}
                    onChange={(e) => setNewBook({ ...newBook, book_title: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Save Book Entry
                  </button>
                </div>
              </form>
            </div>

            {/* CLASS WISE BOOK CARDS GRID */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-white text-base">
                Class-Wise Book Sets ({Object.keys(
                  booksList.reduce((acc: any, b) => {
                    const cls = b.class_name || "General";
                    acc[cls] = true;
                    return acc;
                  }, {})
                ).length} Classes)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Object.entries(
                  booksList.reduce((acc: Record<string, BookItem[]>, b) => {
                    const cls = b.class_name || "General";
                    if (!acc[cls]) acc[cls] = [];
                    acc[cls].push(b);
                    return acc;
                  }, {})
                )
                  .sort(([a], [b]) => {
                    const getWeight = (s: string) => {
                      const l = s.toLowerCase();
                      if (l.includes("nursery")) return -3;
                      if (l.includes("lkg")) return -2;
                      if (l.includes("ukg")) return -1;
                      const m = s.match(/\d+/);
                      return m ? parseInt(m[0], 10) : 99;
                    };
                    return getWeight(a) - getWeight(b);
                  })
                  .map(([clsName, books]) => (
                    <div
                      key={clsName}
                      onClick={() => setSelectedBookClassModal(clsName)}
                      className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            {books.length} {books.length === 1 ? "Book" : "Books"}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-heading font-extrabold text-white text-lg group-hover:text-amber-400 transition-colors">
                            {clsName}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Prescribed Subject Books Directory
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                        <span>Click to View Books</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* CLASS BOOKS MODAL DIALOG */}
            {selectedBookClassModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-bold text-white">
                          {selectedBookClassModal} Textbooks List
                        </h3>
                        <p className="text-xs text-slate-400">Manage prescribed books for this class.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBookClassModal(null)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* Add Book Form inside Modal */}
                  <form onSubmit={handleAddBook} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <h4 className="font-bold text-amber-400">Add New Book to {selectedBookClassModal}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Subject (e.g. Mathematics / Science)"
                        value={newBook.subject}
                        onChange={(e) => setNewBook({ ...newBook, class_name: selectedBookClassModal, subject: e.target.value })}
                        required
                        className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                      />
                      <input
                        type="text"
                        placeholder="Book Title (e.g. NCERT Mathematics Class X)"
                        value={newBook.book_title}
                        onChange={(e) => setNewBook({ ...newBook, class_name: selectedBookClassModal, book_title: e.target.value })}
                        required
                        className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs">
                      + Add Book to {selectedBookClassModal}
                    </button>
                  </form>

                  {/* Books List inside Modal */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-xs">Prescribed Books ({booksList.filter(b => (b.class_name || "General") === selectedBookClassModal).length})</h4>
                    <div className="divide-y divide-slate-800/80 bg-slate-950 rounded-2xl border border-slate-800 p-2">
                      {booksList.filter(b => (b.class_name || "General") === selectedBookClassModal).length === 0 ? (
                        <div className="p-6 text-center text-slate-500 text-xs">No books added for {selectedBookClassModal} yet.</div>
                      ) : (
                        booksList
                          .filter(b => (b.class_name || "General") === selectedBookClassModal)
                          .map((b) => (
                            <div key={b.id} className="p-3 flex items-center justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                                  Subject: {b.subject}
                                </span>
                                <h5 className="font-bold text-white text-xs">{b.book_title}</h5>
                              </div>
                              <button
                                onClick={() => handleDeleteBook(b.id)}
                                className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                                title="Delete Book"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 10: ACHIEVEMENTS ─── */}
        {activeTab === "achievements" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Add School Achievement
              </h3>
              <form onSubmit={handleAddAchievement} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Achievement Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Olympiad Winners"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026"
                    value={newAchievement.year}
                    onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-slate-400 font-bold mb-1">Description / Details</label>
                  <input
                    type="text"
                    placeholder="First place in district level competition..."
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Save Achievement Record
                  </button>
                </div>
              </form>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {achievements.map((a) => (
                <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative">
                  <button onClick={() => handleDeleteAchievement(a.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold text-amber-400">{a.year}</span>
                  <h4 className="font-bold text-white text-sm">{a.title}</h4>
                  <p className="text-xs text-slate-400">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 11: GALLERY PHOTOS ─── */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" /> Upload & Add Gallery Photos (Single or Bulk)
                </h3>
                {bulkGalleryFiles.length > 0 && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    {bulkGalleryFiles.length} Photos Selected for Bulk Upload
                  </span>
                )}
              </div>

              <form onSubmit={handleAddGallery} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Photo Title / Prefix *</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Fair 2026"
                    value={newGallery.title}
                    onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                    required={bulkGalleryFiles.length === 0}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Campus / Sports / Events"
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-slate-400 font-bold mb-1">
                    Select Multiple Photos from Computer (Bulk Upload) OR Enter Image URL *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const filesArr = Array.from(e.target.files);
                            setBulkGalleryFiles(filesArr);
                            compressImageFile(filesArr[0]).then((url) => {
                              setNewGallery((prev) => ({ ...prev, image_url: url }));
                            }).catch(console.error);
                          }
                        }}
                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:bg-amber-500 file:text-slate-950 file:font-bold file:border-0 file:py-1 file:px-3 file:rounded-lg hover:file:bg-amber-400 cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500">Hold Ctrl or Shift to select multiple photos at once</p>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Or paste single image URL..."
                        value={newGallery.image_url}
                        onChange={(e) => setNewGallery({ ...newGallery, image_url: e.target.value })}
                        required={bulkGalleryFiles.length === 0}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={uploadingGallery}
                    className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploadingGallery ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading & Processing Photos...</span>
                      </>
                    ) : bulkGalleryFiles.length > 1 ? (
                      <span>Upload & Save {bulkGalleryFiles.length} Gallery Photos (Bulk)</span>
                    ) : (
                      <span>Save Gallery Photo</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {galleryPhotos.map((g) => (
                <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-2 relative">
                  <img src={g.image_url} alt={g.title} className="w-full h-32 object-cover" />
                  <button onClick={() => handleDeleteGallery(g.id)} className="absolute top-2 right-2 text-red-400 bg-slate-950/80 p-1.5 rounded-full">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="p-3">
                    <h4 className="font-bold text-white text-xs">{g.title}</h4>
                    <p className="text-[10px] text-amber-400">{g.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 12: SCHOOL CALENDAR ─── */}
        {activeTab === "calendar" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" /> Add School Calendar Event
              </h3>
              <form onSubmit={handleAddCalEvent} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Event Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. New Session Begins"
                    value={newCalEvent.title}
                    onChange={(e) => setNewCalEvent({ ...newCalEvent, title: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Date / Month *</label>
                  <input
                    type="text"
                    placeholder="e.g. April 1, 2026"
                    value={newCalEvent.date}
                    onChange={(e) => setNewCalEvent({ ...newCalEvent, date: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={newCalEvent.category}
                    onChange={(e) => setNewCalEvent({ ...newCalEvent, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Exams">Exams</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Save Calendar Schedule
                  </button>
                </div>
              </form>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {calendarEvents.map((c) => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative">
                  <button onClick={() => handleDeleteCalEvent(c.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold text-amber-400">{c.category} | {c.date}</span>
                  <h4 className="font-bold text-white text-sm">{c.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WHATSAPP BIRTHDAY NOTIFICATION ENGINE MODULE */}
        {activeTab === "whatsapp_birthdays" && (
          <WhatsAppBirthdayManager students={students} onRefreshData={loadData} />
        )}

      </main>
    </div>
  );
};
