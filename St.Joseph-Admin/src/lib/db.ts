import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://hzvwkrjydesdvkkcjupj.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dndrcmp5ZGVzZHZra2NqdXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MjIzNTUsImV4cCI6MjEwMTE5ODM1NX0.7yAEaBfJ8mep8ZR-lM37HG1n5zZr5bSDeKxE6miRUlE";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  name: string;
  designation: string;
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

export interface TCRecordData {
  id?: string;
  roll_no: string;
  class: string;
  student_name: string;
  father_name: string;
  dob: string;
  tc_number: string;
  issue_date: string;
  file_path?: string;
  file_url?: string;
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
  category: string;
  file_url: string;
  file_type?: "pdf" | "image" | "link";
  is_official_5?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  date?: string;
  category?: string;
  summary?: string;
  content?: string;
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
  agenda?: string[] | string;
  guidelines?: string[] | string;
  photos?: any;
  badgeColor?: string;
}

export interface BookItem {
  id: string;
  class_name: string;
  subject: string;
  book_title: string;
  publisher?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  category?: string;
  year?: string;
  description?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category?: string;
  image_url: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  category?: string;
  description?: string;
}

// ─── Default Initial Mock Data for Fallback Sync ─────────────────────────────

const initialTeachers: Teacher[] = [
  {
    id: "t1",
    name: "Mr. Praveen Tyagi",
    designation: "Principal",
    department: "Administration",
    dob: "1980-08-15",
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    email: "principal@stjosephdholpur.com",
    wishes: "Wishing our beloved Principal a joyful birthday!",
  },
  {
    id: "t2",
    name: "Mrs. Sunita Sharma",
    designation: "PGT Mathematics",
    department: "Science & Math",
    dob: "1988-08-02",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    email: "sunita.sharma@stjosephdholpur.com",
    wishes: "May your day be filled with mathematics of joy and happiness!",
  },
  {
    id: "t3",
    name: "Mr. Rajesh Verma",
    designation: "TGT English Literature",
    department: "Humanities",
    dob: "1992-08-05",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    email: "rajesh.verma@stjosephdholpur.com",
    wishes: "Happy Birthday! Thank you for inspiring our students every day.",
  },
];

const initialStudents: Student[] = [
  {
    id: "s1",
    name: "Aarav Sharma",
    class: "Class X-A",
    roll_no: "1001",
    dob: "2010-08-02",
    photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Aarav! Wishing you brilliant success in Class 10!",
  },
  {
    id: "s2",
    name: "Ananya Gupta",
    class: "Class VIII-B",
    roll_no: "8042",
    dob: "2012-08-03",
    photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Ananya! Keep shining bright!",
  },
  {
    id: "s3",
    name: "Rohan Singh",
    class: "Class XII Science",
    roll_no: "12015",
    dob: "2008-08-06",
    photo_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Rohan! Best wishes for your board year!",
  },
];

const initialFeeStructure: FeeSection[] = [
  {
    id: "fee-1",
    title: "Pre-Primary (PG to UKG)",
    total: "22,900",
    admissionPay: "11,200",
    data: [
      { label: "Registration Fee", amount: "1000" },
      { label: "Admission Fee", amount: "3000" },
      { label: "ID Card, Belt, Diary", amount: "500" },
      { label: "Activities & Misc", amount: "2000" },
      { label: "Exam Fee", amount: "2000" },
      { label: "Tuition Fee (Monthly)", amount: "1200" },
    ],
  },
  {
    id: "fee-2",
    title: "Primary (Class 1st to 5th)",
    total: "27,000",
    admissionPay: "12,500",
    data: [
      { label: "Registration Fee", amount: "1000" },
      { label: "Admission Fee", amount: "3000" },
      { label: "ID Card, Belt, Diary", amount: "500" },
      { label: "Activities & Misc", amount: "2500" },
      { label: "Exam Fee", amount: "2000" },
      { label: "Tuition Fee (Monthly)", amount: "1500" },
    ],
  },
];

const initialRoutes: TransportRoute[] = [
  {
    id: "r1",
    area: "Dholpur City & Railway Station",
    busNo: "RJ-11-PA-101",
    stops: "Gulab Bagh, Ondela Road, Police Line, RAC Line, Railway Station",
    pickupTime: "07:00 AM",
    dropTime: "02:15 PM",
    driverName: "Mr. Ram Singh",
    driverPhone: "+91 98291-11223",
    monthlyFee: "1,200",
    status: "live",
  },
];

const initialTCs: TCRecordData[] = [
  {
    id: "tc-1",
    roll_no: "1001",
    class: "10",
    student_name: "Aarav Sharma",
    father_name: "Rajendra Sharma",
    dob: "2010-08-02",
    tc_number: "TC-2026-001",
    issue_date: "2026-05-15",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

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

// ─── API Services ─────────────────────────────────────────────────────────────

// 1. TC Service
export async function fetchTCs(): Promise<TCRecordData[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("tc_records").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_tc_records", initialTCs);
}

export async function uploadAndSaveTC(
  file: File | null,
  record: Omit<TCRecordData, "id" | "file_path" | "file_url" | "created_at">
): Promise<TCRecordData> {
  let file_url = "";
  let file_path = "";

  if (file && SUPABASE_ANON_KEY) {
    try {
      const cleanClass = record.class.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanRoll = record.roll_no.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `TC_${cleanClass}_${cleanRoll}_${Date.now()}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from("tc-certificates")
        .upload(fileName, file, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("tc-certificates")
          .getPublicUrl(fileName);

        file_url = publicUrlData.publicUrl;
        file_path = fileName;
      }
    } catch (e) {
      console.warn("Storage upload error fallback", e);
    }
  }

  // If local file object is provided without Supabase storage URL, read as persistent Data URL
  if (file && !file_url) {
    file_url = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  }

  const newRecord: TCRecordData = {
    id: `tc_${Date.now()}`,
    roll_no: record.roll_no.trim(),
    class: record.class.trim(),
    student_name: record.student_name.trim(),
    father_name: record.father_name.trim(),
    dob: record.dob.trim(),
    tc_number: record.tc_number.trim(),
    issue_date: record.issue_date.trim(),
    file_path: file_path,
    file_url: file_url || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: new Date().toISOString(),
  };

  if (SUPABASE_ANON_KEY) {
    try {
      const dbPayload = {
        roll_no: newRecord.roll_no,
        class: newRecord.class,
        student_name: newRecord.student_name,
        father_name: newRecord.father_name,
        dob: newRecord.dob,
        tc_number: newRecord.tc_number,
        issue_date: newRecord.issue_date,
        file_path: newRecord.file_path,
        file_url: newRecord.file_url,
      };
      const { data, error } = await supabase.from("tc_records").insert([dbPayload]).select().single();
      if (data?.id) {
        newRecord.id = data.id;
      }
    } catch (e) {
      console.warn("Supabase insert error", e);
    }
  }

  const list = getStorage<TCRecordData[]>("stj_tc_records", initialTCs);
  list.unshift(newRecord);
  setStorage("stj_tc_records", list);
  return newRecord;
}

export async function saveTCRecord(tc: Omit<TCRecordData, "id"> & { id?: string }): Promise<TCRecordData> {
  const newRecord: TCRecordData = {
    id: tc.id || `tc_${Date.now()}`,
    roll_no: tc.roll_no.trim(),
    class: tc.class.trim(),
    student_name: tc.student_name.trim(),
    father_name: tc.father_name.trim(),
    dob: tc.dob.trim(),
    tc_number: tc.tc_number.trim(),
    issue_date: tc.issue_date.trim(),
    file_url: tc.file_url || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: new Date().toISOString(),
  };

  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("tc_records").upsert([newRecord]);
    } catch (e) { }
  }

  const list = getStorage("stj_tc_records", initialTCs);
  const idx = list.findIndex((x) => x.id === newRecord.id);
  if (idx >= 0) list[idx] = newRecord;
  else list.unshift(newRecord);

  setStorage("stj_tc_records", list);
  return newRecord;
}

export async function deleteTCRecord(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("tc_records").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<TCRecordData[]>("stj_tc_records", initialTCs).filter((x) => x.id !== id);
  setStorage("stj_tc_records", list);
}

// 2. Teachers Service
export async function fetchTeachers(): Promise<Teacher[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("teachers").select("*").order("name");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_teachers", initialTeachers);
}

export async function saveTeacherRecord(t: Omit<Teacher, "id"> & { id?: string }): Promise<Teacher> {
  const record: Teacher = {
    id: t.id || `t_${Date.now()}`,
    name: t.name,
    designation: t.designation,
    department: t.department || "General",
    dob: t.dob,
    photo_url: t.photo_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    email: t.email || "",
    phone: t.phone || "",
    wishes: t.wishes || "Happy Birthday!",
    created_at: new Date().toISOString(),
  };

  if (SUPABASE_ANON_KEY) {
    try {
      const dbPayload: any = {
        name: record.name,
        designation: record.designation,
        department: record.department,
        dob: record.dob,
        photo_url: record.photo_url,
        email: record.email,
        phone: record.phone,
        wishes: record.wishes,
      };
      if (t.id && !t.id.startsWith("t_")) {
        dbPayload.id = t.id;
      }

      const { data, error } = await supabase.from("teachers").upsert([dbPayload]).select();
      if (error) {
        console.error("Supabase teacher save error:", error);
        alert("⚠️ Supabase Save Error: " + error.message);
      } else if (data && data[0]?.id) {
        record.id = data[0].id;
      }
    } catch (e: any) {
      console.error("Supabase teacher save exception:", e);
      alert("⚠️ Connection Exception: " + e.message);
    }
  }

  const list = getStorage("stj_teachers", initialTeachers);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_teachers", list);
  return record;
}

export async function deleteTeacherRecord(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("teachers").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<Teacher[]>("stj_teachers", initialTeachers).filter((x) => x.id !== id);
  setStorage("stj_teachers", list);
}

// 3. Students Service
export async function fetchStudents(): Promise<Student[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("students").select("*").order("name");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_students", initialStudents);
}

export async function saveStudentRecord(s: Omit<Student, "id"> & { id?: string }): Promise<Student> {
  const record: Student = {
    id: s.id || `s_${Date.now()}`,
    name: s.name,
    class: s.class,
    section: s.section || "A",
    roll_no: s.roll_no || "",
    dob: s.dob,
    photo_url: s.photo_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    wishes: s.wishes || "Happy Birthday!",
    created_at: new Date().toISOString(),
  };

  if (SUPABASE_ANON_KEY) {
    try {
      const dbPayload: any = {
        name: record.name,
        class: record.class,
        section: record.section,
        roll_no: record.roll_no,
        dob: record.dob,
        photo_url: record.photo_url,
        wishes: record.wishes,
      };
      if (s.id && !s.id.startsWith("s_")) {
        dbPayload.id = s.id;
      }

      const { data, error } = await supabase.from("students").upsert([dbPayload]).select();
      if (error) {
        console.error("Supabase student save error:", error);
      } else if (data && data[0]?.id) {
        record.id = data[0].id;
      }
    } catch (e) {
      console.error("Supabase student save exception:", e);
    }
  }

  const list = getStorage("stj_students", initialStudents);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_students", list);
  return record;
}

export async function deleteStudentRecord(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("students").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<Student[]>("stj_students", initialStudents).filter((x) => x.id !== id);
  setStorage("stj_students", list);
}

// 4. Fees Service
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

function cleanPayload(record: any) {
  const { id, ...rest } = record;
  const isUuid = id && typeof id === "string" && id.includes("-") && id.length > 25;
  return isUuid ? record : rest;
}

// 5. Transport Service
export async function fetchTransportRoutes(): Promise<TransportRoute[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("transportation").select("*");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_transport_routes", initialRoutes);
}

export async function saveTransportRoute(r: Omit<TransportRoute, "id"> & { id?: string }): Promise<TransportRoute> {
  const record: TransportRoute = {
    id: r.id || `r_${Date.now()}`,
    area: r.area,
    busNo: r.busNo,
    stops: r.stops,
    pickupTime: r.pickupTime,
    dropTime: r.dropTime || "02:30 PM",
    driverName: r.driverName || "Driver",
    driverPhone: r.driverPhone || "+91-88245-51683",
    monthlyFee: r.monthlyFee || "1,200",
    status: r.status || "active",
  };

  if (SUPABASE_ANON_KEY) {
    try {
      const payload = cleanPayload(record);
      const { data, error } = await supabase.from("transportation").upsert([payload]).select().single();
      if (error) console.warn("Supabase transport save error:", error);
      if (data?.id) record.id = data.id;
    } catch (e) { }
  }

  const list = getStorage("stj_transport_routes", initialRoutes);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_transport_routes", list);
  return record;
}

export async function deleteTransportRoute(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("transportation").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<TransportRoute[]>("stj_transport_routes", initialRoutes).filter((x) => x.id !== id);
  setStorage("stj_transport_routes", list);
}

// 6. Mandatory Docs Service
export async function fetchMandatoryDocs(): Promise<MandatoryDoc[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("mandatory_disclosures").select("*");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_mandatory_docs", []);
}

export async function saveMandatoryDoc(doc: Omit<MandatoryDoc, "id"> & { id?: string }): Promise<MandatoryDoc> {
  const record: MandatoryDoc = {
    id: doc.id || `md_${Date.now()}`,
    title: doc.title,
    category: doc.category,
    file_url: doc.file_url,
    file_type: doc.file_type || "pdf",
    is_official_5: doc.is_official_5 ?? true,
  };
  if (SUPABASE_ANON_KEY) {
    try {
      const payload = cleanPayload(record);
      const { data, error } = await supabase.from("mandatory_disclosures").upsert([payload]).select().single();
      if (error) console.warn("Supabase disclosure save error:", error);
      if (data?.id) record.id = data.id;
    } catch (e) { }
  }
  const list = getStorage<MandatoryDoc[]>("stj_mandatory_docs", []);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_mandatory_docs", list);
  return record;
}

export async function deleteMandatoryDoc(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("mandatory_disclosures").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<MandatoryDoc[]>("stj_mandatory_docs", []).filter((x) => x.id !== id);
  setStorage("stj_mandatory_docs", list);
}

// 7. News Service
export async function fetchNews(): Promise<NewsItem[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_news", []);
}

export async function saveNews(item: Omit<NewsItem, "id"> & { id?: string }): Promise<NewsItem> {
  const record: NewsItem = {
    id: item.id || `news_${Date.now()}`,
    title: item.title,
    date: item.date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    category: item.category || "Announcement",
    summary: item.summary || item.content || "",
    content: item.content || item.summary || "",
  };
  if (SUPABASE_ANON_KEY) {
    try {
      const payload = cleanPayload(record);
      const { data, error } = await supabase.from("news").upsert([payload]).select().single();
      if (error) console.warn("Supabase news save error:", error);
      if (data?.id) record.id = data.id;
    } catch (e) { }
  }
  const list = getStorage<NewsItem[]>("stj_news", []);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_news", list);
  return record;
}

export async function deleteNews(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("news").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<NewsItem[]>("stj_news", []).filter((x) => x.id !== id);
  setStorage("stj_news", list);
}

// 8. Events Service
export async function fetchEvents(): Promise<EventItem[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_events", []);
}

export async function saveEvent(item: Omit<EventItem, "id"> & { id?: string }): Promise<EventItem> {
  const record: EventItem = {
    id: item.id || `evt_${Date.now()}`,
    title: item.title,
    date: item.date,
    time: item.time || "09:00 AM",
    location: item.location || "School Grounds",
    category: item.category || "Celebration",
    status: item.status || "Upcoming",
    shortDesc: item.shortDesc || item.description || "",
    fullDesc: item.fullDesc || item.description || item.shortDesc || "",
    description: item.description || item.shortDesc || "",
    chiefGuest: item.chiefGuest || "",
    targetAudience: item.targetAudience || "Students, Staff & Parents",
    agenda: item.agenda || [],
    guidelines: item.guidelines || [],
    photos: item.photos || [],
    badgeColor: item.badgeColor || "bg-blue-600 text-white",
  };
  if (SUPABASE_ANON_KEY) {
    try {
      const payload = cleanPayload(record);
      const { data, error } = await supabase.from("events").upsert([payload]).select().single();
      if (error) console.warn("Supabase events save error:", error);
      if (data?.id) record.id = data.id;
    } catch (e) { }
  }
  const list = getStorage<EventItem[]>("stj_events", []);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_events", list);
  return record;
}

export async function deleteEvent(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("events").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<EventItem[]>("stj_events", []).filter((x) => x.id !== id);
  setStorage("stj_events", list);
}

// 9. Books Service
export async function fetchBooks(): Promise<BookItem[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("books").select("*");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_books", []);
}

export async function saveBook(item: Omit<BookItem, "id"> & { id?: string }): Promise<BookItem> {
  const record: BookItem = {
    id: item.id || `bk_${Date.now()}`,
    class_name: item.class_name,
    subject: item.subject,
    book_title: item.book_title,
    publisher: item.publisher || "NCERT / Standard",
  };
  if (SUPABASE_ANON_KEY) {
    try {
      const payload = cleanPayload(record);
      const { data, error } = await supabase.from("books").upsert([payload]).select().single();
      if (error) console.warn("Supabase books save error:", error);
      if (data?.id) record.id = data.id;
    } catch (e) { }
  }
  const list = getStorage<BookItem[]>("stj_books", []);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_books", list);
  return record;
}

export async function deleteBook(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("books").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<BookItem[]>("stj_books", []).filter((x) => x.id !== id);
  setStorage("stj_books", list);
}

// 10. Achievements Service
export async function fetchAchievements(): Promise<AchievementItem[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("achievements").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_achievements", []);
}

export async function saveAchievement(item: Omit<AchievementItem, "id"> & { id?: string }): Promise<AchievementItem> {
  const record: AchievementItem = {
    id: item.id || `ach_${Date.now()}`,
    title: item.title,
    category: item.category || "Excellence",
    year: item.year || new Date().getFullYear().toString(),
    description: item.description || "",
  };
  if (SUPABASE_ANON_KEY) {
    try {
      const payload = cleanPayload(record);
      const { data, error } = await supabase.from("achievements").upsert([payload]).select().single();
      if (error) console.warn("Supabase achievements save error:", error);
      if (data?.id) record.id = data.id;
    } catch (e) { }
  }
  const list = getStorage<AchievementItem[]>("stj_achievements", []);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_achievements", list);
  return record;
}

export async function deleteAchievement(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("achievements").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<AchievementItem[]>("stj_achievements", []).filter((x) => x.id !== id);
  setStorage("stj_achievements", list);
}

// Supabase Storage Bucket Helper for 10x Fast CDN Image Loading
export async function uploadImageToSupabaseStorage(dataUrlOrFile: string | File, bucketName = "gallery"): Promise<string> {
  if (!SUPABASE_ANON_KEY) return typeof dataUrlOrFile === "string" ? dataUrlOrFile : "";

  try {
    let fileBlob: Blob;
    let extension = "jpg";

    if (dataUrlOrFile instanceof File) {
      fileBlob = dataUrlOrFile;
      extension = dataUrlOrFile.name.split(".").pop() || "jpg";
    } else if (typeof dataUrlOrFile === "string" && dataUrlOrFile.startsWith("data:")) {
      const arr = dataUrlOrFile.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      extension = mime.split("/")[1] || "jpg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      fileBlob = new Blob([u8arr], { type: mime });
    } else {
      return dataUrlOrFile;
    }

    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
    
    // Upload binary blob to Supabase Storage bucket
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, fileBlob, {
      contentType: fileBlob.type || "image/jpeg",
      upsert: true
    });

    if (error) {
      console.warn("Supabase Storage upload error details:", error);
    }

    if (!error && data?.path) {
      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      if (publicData?.publicUrl) {
        return publicData.publicUrl;
      }
    }
  } catch (err) {
    console.warn("Supabase Storage upload fallback to compressed DataURL:", err);
  }

  return typeof dataUrlOrFile === "string" ? dataUrlOrFile : "";
}

// 11. Gallery Service
export async function fetchGallery(): Promise<GalleryItem[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("gallery").select("*");
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_gallery", []);
}

export async function saveGallery(item: Omit<GalleryItem, "id"> & { id?: string }): Promise<GalleryItem> {
  let finalImageUrl = item.image_url;

  // Upload to Supabase Storage Bucket for lightning fast CDN loading if possible
  if (item.image_url && item.image_url.startsWith("data:")) {
    const bucketUrl = await uploadImageToSupabaseStorage(item.image_url, "gallery");
    if (bucketUrl && bucketUrl.startsWith("http")) {
      finalImageUrl = bucketUrl;
    }
  }

  const record: GalleryItem = {
    id: item.id || `gal_${Date.now()}`,
    title: item.title,
    category: item.category || "Campus",
    image_url: finalImageUrl,
  };
  if (SUPABASE_ANON_KEY) {
    try {
      const payload = cleanPayload(record);
      const { data, error } = await supabase.from("gallery").upsert([payload]).select().single();
      if (error) console.warn("Supabase gallery save error:", error);
      if (data?.id) record.id = data.id;
    } catch (e) { }
  }
  const list = getStorage<GalleryItem[]>("stj_gallery", []);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_gallery", list);
  return record;
}

export async function deleteGallery(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("gallery").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<GalleryItem[]>("stj_gallery", []).filter((x) => x.id !== id);
  setStorage("stj_gallery", list);
}

// 12. Calendar Service
export async function fetchCalendar(): Promise<CalendarEvent[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("calendar").select("*").order("date", { ascending: true });
      if (!error && data) return data;
    } catch (e) { }
  }
  return getStorage("stj_calendar", []);
}

export async function saveCalendar(item: Omit<CalendarEvent, "id"> & { id?: string }): Promise<CalendarEvent> {
  const record: CalendarEvent = {
    id: item.id || `cal_${Date.now()}`,
    title: item.title,
    date: item.date,
    category: item.category || "Academic",
    description: item.description || "",
  };
  if (SUPABASE_ANON_KEY) {
    try {
      const payload = cleanPayload(record);
      const { data, error } = await supabase.from("calendar").upsert([payload]).select().single();
      if (error) console.warn("Supabase calendar save error:", error);
      if (data?.id) record.id = data.id;
    } catch (e) { }
  }
  const list = getStorage<CalendarEvent[]>("stj_calendar", []);
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  setStorage("stj_calendar", list);
  return record;
}

export async function deleteCalendar(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("calendar").delete().eq("id", id);
    } catch (e) { }
  }
  const list = getStorage<CalendarEvent[]>("stj_calendar", []).filter((x) => x.id !== id);
  setStorage("stj_calendar", list);
}
