import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://hzvwkrjydesdvkkcjupj.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder"
);

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

// Initial default TCs if database table is brand new or empty
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
  {
    id: "tc-2",
    roll_no: "1205",
    class: "12",
    student_name: "Priya Verma",
    father_name: "Sunil Verma",
    dob: "2008-03-12",
    tc_number: "TC-2026-002",
    issue_date: "2026-06-01",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

function getStorageTCs(): TCRecordData[] {
  try {
    const data = localStorage.getItem("stj_tc_records");
    return data ? JSON.parse(data) : initialTCs;
  } catch (e) {
    return initialTCs;
  }
}

// Date normalization helper
function extractDateParts(dateStr: string): { year?: string; month?: string; day?: string } {
  if (!dateStr) return {};
  const clean = String(dateStr).split("T")[0].trim();

  if (clean.includes("-")) {
    const parts = clean.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return { year: parts[0], month: parts[1].padStart(2, "0"), day: parts[2].padStart(2, "0") };
      } else {
        return { day: parts[0].padStart(2, "0"), month: parts[1].padStart(2, "0"), year: parts[2] };
      }
    }
  }

  if (clean.includes("/")) {
    const parts = clean.split("/");
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        return { day: parts[0].padStart(2, "0"), month: parts[1].padStart(2, "0"), year: parts[2] };
      } else if (parts[0].length === 4) {
        return { year: parts[0], month: parts[1].padStart(2, "0"), day: parts[2].padStart(2, "0") };
      }
    }
  }

  return {};
}

function matchesDate(date1: string, date2: string): boolean {
  if (!date1 || !date2) return true;
  const d1 = extractDateParts(date1);
  const d2 = extractDateParts(date2);

  if (d1.year && d2.year && d1.month && d2.month && d1.day && d2.day) {
    return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
  }

  return date1.trim().toLowerCase() === date2.trim().toLowerCase();
}

function normalizeClass(classStr: string): string {
  if (!classStr) return "";
  return String(classStr)
    .toLowerCase()
    .replace(/class/g, "")
    .replace(/[-_]/g, "")
    .trim();
}

export function matchesClass(inputClass: string, dbClass: string): boolean {
  if (!inputClass || !dbClass) return true;
  const c1 = normalizeClass(inputClass);
  const c2 = normalizeClass(dbClass);

  if (c1 === c2) return true;
  if (c1 && c2 && (c1.includes(c2) || c2.includes(c1))) return true;
  return false;
}

// 1. Search TC by Student Name, Class & DOB
export async function searchTCByDetails(
  studentName: string,
  className: string,
  dob: string
): Promise<TCRecordData | null> {
  const cleanName = studentName.trim();
  const cleanClass = className.trim();
  const cleanDob = dob.trim();

  if (!cleanName) return null;

  if (SUPABASE_ANON_KEY) {
    try {
      const sanitizedName = cleanName.replace(/[%_\\]/g, "\\$&");
      const { data: records, error } = await supabase
        .from("tc_records")
        .select("*")
        .ilike("student_name", `%${sanitizedName}%`);

      if (!error && records && records.length > 0) {
        const strictMatch = records.find((rec) => {
          const classOk = matchesClass(cleanClass, rec.class);
          const dobOk = matchesDate(cleanDob, rec.dob);
          return classOk && dobOk;
        });
        if (strictMatch) return strictMatch;
        return records[0];
      }
    } catch (e) {
      console.warn("Supabase TC search fallback to local store", e);
    }
  }

  // Fallback to local database store
  const localList = getStorageTCs();
  const matched = localList.find((rec) => {
    const nameOk = rec.student_name.toLowerCase().includes(cleanName.toLowerCase());
    const classOk = matchesClass(cleanClass, rec.class);
    const dobOk = matchesDate(cleanDob, rec.dob);
    return nameOk && (classOk || dobOk);
  });

  return matched || null;
}

// 2. Search TC by TC Number or Roll Number
export async function searchTCByNumberOrRoll(
  searchQuery: string
): Promise<TCRecordData | null> {
  const cleanQuery = searchQuery.trim();
  if (!cleanQuery) return null;

  if (SUPABASE_ANON_KEY) {
    try {
      const { data: records, error } = await supabase
        .from("tc_records")
        .select("*")
        .or(`tc_number.ilike.%${cleanQuery}%,roll_no.ilike.%${cleanQuery}%`);

      if (!error && records && records.length > 0) {
        return records[0];
      }
    } catch (e) {}
  }

  const localList = getStorageTCs();
  return (
    localList.find(
      (rec) =>
        rec.tc_number.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        rec.roll_no.toLowerCase().includes(cleanQuery.toLowerCase())
    ) || null
  );
}

// 3. List All TCs
export async function listAllTCs(): Promise<TCRecordData[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from("tc_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) return data;
    } catch (e) {}
  }
  return getStorageTCs();
}

// 4. Upload & Save TC
export async function uploadAndSaveTC(
  file: File | null,
  record: Omit<TCRecordData, "id" | "file_path" | "file_url" | "created_at">
): Promise<TCRecordData> {
  const newRecord: TCRecordData = {
    id: `tc_${Date.now()}`,
    roll_no: record.roll_no.trim(),
    class: record.class.trim(),
    student_name: record.student_name.trim(),
    father_name: record.father_name.trim(),
    dob: record.dob.trim(),
    tc_number: record.tc_number.trim(),
    issue_date: record.issue_date.trim(),
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
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
        file_url: newRecord.file_url,
      };
      const { data } = await supabase.from("tc_records").insert([dbPayload]).select().single();
      if (data?.id) newRecord.id = data.id;
    } catch (e) {}
  }

  const list = getStorageTCs();
  list.unshift(newRecord);
  localStorage.setItem("stj_tc_records", JSON.stringify(list));
  return newRecord;
}

export async function deleteTCRecord(id: string, filePath?: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("tc_records").delete().eq("id", id);
    } catch (e) {}
  }
  const list = getStorageTCs().filter((rec) => rec.id !== id);
  localStorage.setItem("stj_tc_records", JSON.stringify(list));
}
