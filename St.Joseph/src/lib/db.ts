import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from environment or default to provided URL
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://hzvwkrjydesdvkkcjupj.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder"
);

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  name: string;
  designation: string; // e.g. PGT Mathematics, Primary Teacher
  department?: string;
  dob: string; // YYYY-MM-DD
  photo_url?: string;
  email?: string;
  phone?: string;
  wishes?: string;
  created_at?: string;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  section?: string;
  roll_no?: string;
  dob: string; // YYYY-MM-DD
  photo_url?: string;
  wishes?: string;
  created_at?: string;
}

export interface FeeItem {
  label: string;
  amount: string;
}

export interface FeeSection {
  id: string;
  title: string;
  total: string;
  admissionPay: string;
  data: FeeItem[];
  created_at?: string;
}

export interface TransportRoute {
  id: string;
  area: string;
  busNo: string;
  stops: string;
  pickupTime: string;
  dropTime?: string;
  driverName?: string;
  driverPhone?: string;
  monthlyFee?: string;
  status: "live" | "done" | "upcoming" | "active";
}

export interface MandatoryDoc {
  id: string;
  title: string;
  category: "CBSE" | "Safety" | "Society" | "Academics" | "Other";
  file_url: string;
  issue_date?: string;
  file_type?: "pdf" | "image" | "link";
  is_official_5?: boolean; // Highlight top 5 certificates
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content?: string;
  image_url?: string;
  is_pinned?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  image_url?: string;
}

export interface BookItem {
  id: string;
  class_name: string;
  subject: string;
  book_title: string;
  publisher: string;
  download_url?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image_url?: string;
  student_name?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  date?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  category: "Academic" | "Holiday" | "Exams" | "Sports" | "Cultural";
  description?: string;
}

// ─── Initial Mock Data Default (Empty for Database Sync) ─────────────────────

const initialTeachers: Teacher[] = [];
const initialStudents: Student[] = [];
const initialFeeStructure: FeeSection[] = [];
const initialRoutes: TransportRoute[] = [];
const initialMandatoryDocs: MandatoryDoc[] = [];

// Local Storage Helper Utilities with event sync
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("stjoseph_db_updated"));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// ─── Service API Implementations ──────────────────────────────────────────────

// 1. Teachers Service
export async function fetchTeachers(): Promise<Teacher[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("teachers").select("*").order("name");
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase fetchTeachers fallback to local store", e);
    }
  }
  return getStorage("stj_teachers", initialTeachers);
}

export async function saveTeacherRecord(teacher: Omit<Teacher, "id"> & { id?: string }): Promise<Teacher> {
  const newRecord: Teacher = {
    id: teacher.id || `t_${Date.now()}`,
    name: teacher.name,
    designation: teacher.designation,
    department: teacher.department || "General",
    dob: teacher.dob,
    photo_url: teacher.photo_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    email: teacher.email || "",
    wishes: teacher.wishes || "Happy Birthday!",
    created_at: new Date().toISOString(),
  };

  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("teachers").upsert([newRecord]);
    } catch (e) {
      console.warn("Supabase save error", e);
    }
  }

  const list = getStorage("stj_teachers", initialTeachers);
  const existingIdx = list.findIndex((t) => t.id === newRecord.id);
  if (existingIdx >= 0) {
    list[existingIdx] = newRecord;
  } else {
    list.unshift(newRecord);
  }
  setStorage("stj_teachers", list);
  return newRecord;
}

export async function deleteTeacherRecord(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("teachers").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<Teacher[]>("stj_teachers", initialTeachers).filter((t) => t.id !== id);
  setStorage("stj_teachers", list);
}

// 2. Students Service
export async function fetchStudents(): Promise<Student[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("students").select("*").order("name");
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase fetchStudents fallback", e);
    }
  }
  return getStorage("stj_students", initialStudents);
}

export async function saveStudentRecord(student: Omit<Student, "id"> & { id?: string }): Promise<Student> {
  const newRecord: Student = {
    id: student.id || `s_${Date.now()}`,
    name: student.name,
    class: student.class,
    section: student.section || "A",
    roll_no: student.roll_no || "",
    dob: student.dob,
    photo_url: student.photo_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    wishes: student.wishes || "Happy Birthday!",
    created_at: new Date().toISOString(),
  };

  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("students").upsert([newRecord]);
    } catch (e) { }
  }

  const list = getStorage("stj_students", initialStudents);
  const existingIdx = list.findIndex((s) => s.id === newRecord.id);
  if (existingIdx >= 0) {
    list[existingIdx] = newRecord;
  } else {
    list.unshift(newRecord);
  }
  setStorage("stj_students", list);
  return newRecord;
}

export async function deleteStudentRecord(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("students").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<Student[]>("stj_students", initialStudents).filter((s) => s.id !== id);
  setStorage("stj_students", list);
}

// 3. Fee Structure Service
export async function fetchFeeStructure(): Promise<FeeSection[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("fee_structure").select("*");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_fee_structure", initialFeeStructure);
}

export async function saveFeeStructure(sections: FeeSection[]): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("fee_structure").upsert(sections);
    } catch (e) { }
  }
  setStorage("stj_fee_structure", sections);
}

// 4. Transportation Service
export async function fetchTransportRoutes(): Promise<TransportRoute[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("transportation").select("*");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_transport_routes", initialRoutes);
}

export async function saveTransportRoute(route: Omit<TransportRoute, "id"> & { id?: string }): Promise<TransportRoute> {
  const newRoute: TransportRoute = {
    id: route.id || `r_${Date.now()}`,
    area: route.area,
    busNo: route.busNo,
    stops: route.stops,
    pickupTime: route.pickupTime,
    dropTime: route.dropTime || "02:30 PM",
    driverName: route.driverName || "School Bus Driver",
    driverPhone: route.driverPhone || "+91-88245-51683",
    monthlyFee: route.monthlyFee || "1,200",
    status: route.status || "active",
  };

  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("transportation").upsert([newRoute]);
    } catch (e) { }
  }

  const list = getStorage("stj_transport_routes", initialRoutes);
  const idx = list.findIndex((r) => r.id === newRoute.id);
  if (idx >= 0) list[idx] = newRoute;
  else list.unshift(newRoute);

  setStorage("stj_transport_routes", list);
  return newRoute;
}

export async function deleteTransportRoute(id: string): Promise<void> {
  const list = getStorage<TransportRoute[]>("stj_transport_routes", initialRoutes).filter((r) => r.id !== id);
  setStorage("stj_transport_routes", list);
}

// 5. Mandatory Docs Service
export async function fetchMandatoryDocs(): Promise<MandatoryDoc[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("mandatory_disclosures").select("*");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_mandatory_docs", initialMandatoryDocs);
}

export async function saveMandatoryDoc(doc: Omit<MandatoryDoc, "id"> & { id?: string }): Promise<MandatoryDoc> {
  const newDoc: MandatoryDoc = {
    id: doc.id || `md_${Date.now()}`,
    title: doc.title,
    category: doc.category,
    file_url: doc.file_url,
    file_type: doc.file_type || "pdf",
    is_official_5: doc.is_official_5 ?? true,
  };
  const list = getStorage("stj_mandatory_docs", initialMandatoryDocs);
  const idx = list.findIndex((d) => d.id === newDoc.id);
  if (idx >= 0) list[idx] = newDoc;
  else list.unshift(newDoc);

  setStorage("stj_mandatory_docs", list);
  return newDoc;
}

export async function deleteMandatoryDoc(id: string): Promise<void> {
  const list = getStorage<MandatoryDoc[]>("stj_mandatory_docs", initialMandatoryDocs).filter((d) => d.id !== id);
  setStorage("stj_mandatory_docs", list);
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category?: string;
  status?: string;
  shortDesc?: string;
  fullDesc?: string;
  description?: string;
  chiefGuest?: string;
  targetAudience?: string;
  agenda?: any;
  guidelines?: any;
  photos?: any;
  badgeColor?: string;
  image_url?: string;
}

// 6. Books Service
export async function fetchBooks(): Promise<BookItem[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("books").select("*");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_books", []);
}

// 7. Events Service
export async function fetchEvents(): Promise<EventItem[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_events", []);
}

export interface NewsItem {
  id: string;
  title: string;
  date?: string;
  category?: string;
  summary?: string;
  content?: string;
  image_url?: string;
  is_pinned?: boolean;
  created_at?: string;
}

// 8. News Service
export async function fetchNews(): Promise<NewsItem[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_news", []);
}
