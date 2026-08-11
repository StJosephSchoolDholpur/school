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
  emp_id?: string;
  name: string;
  gender?: string;
  designation: string;
  department?: string;
  dob: string; // YYYY-MM-DD
  joining_date?: string;
  qualification?: string;
  experience_years?: string;
  subjects_taught?: string;
  classes_assigned?: string;
  phone?: string;
  email?: string;
  address?: string;
  city_state?: string;
  pincode?: string;
  blood_group?: string;
  aadhaar_no?: string;
  pan_no?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  pay_grade?: string;
  is_active?: boolean;
  photo_url?: string;
  wishes?: string;
  created_at?: string;
}

export interface Student {
  id: string;
  form_no?: string;
  session?: string;
  name: string;
  student_name?: string;
  admission_no?: string;
  class: string;
  section?: string;
  roll_no?: string;
  dob: string; // YYYY-MM-DD
  age_march31?: string;
  blood_group?: string;
  nationality?: string;
  religion?: string;
  category?: string;
  gender?: string;
  medical_condition?: string;
  address?: string;
  city_state?: string;
  pincode?: string;
  whatsapp_no?: string;
  parent_mobile?: string;

  // Mother details
  mother_name?: string;
  mother_age?: string;
  mother_qualification?: string;
  mother_profession?: string;
  mother_city_state?: string;
  mother_whatsapp?: string;
  mother_email?: string;

  // Father details
  father_name?: string;
  father_age?: string;
  father_qualification?: string;
  father_profession?: string;
  father_city_state?: string;
  father_whatsapp?: string;
  father_email?: string;

  // Previous school & Sibling
  previous_school_name?: string;
  previous_class?: string;
  previous_medium?: string;
  previous_board?: string;
  previous_school_address?: string;
  previous_marks?: string;
  has_sibling?: boolean;
  sibling_name?: string;
  sibling_admission_no?: string;
  sibling_class?: string;

  // Office Use
  admission_date?: string;
  transport_required?: boolean;
  total_fees?: number;
  documents_submitted?: string[];
  councillor_sign?: string;
  accountant_sign?: string;

  photo_url?: string;
  active_status?: boolean;
  wishes?: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  class: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Leave";
  remarks?: string;
  created_at?: string;
}

export interface ExamMarkRecord {
  id: string;
  student_id: string;
  student_name: string;
  class: string;
  exam_name: string;
  subject: string;
  max_marks: number;
  marks_obtained: number;
  grade?: string;
  created_at?: string;
}

export interface FeeReceiptRecord {
  id: string;
  receipt_no: string;
  student_id: string;
  student_name: string;
  class: string;
  amount_paid: number;
  payment_mode: "Cash" | "UPI" | "NetBanking" | "Cheque";
  transaction_id?: string;
  payment_date: string;
  collected_by?: string;
  remarks?: string;
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

export interface ClassEntity {
  id: string;
  name: string;
  code?: string;
  stream?: string;
  display_order?: number;
  is_active?: boolean;
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
    emp_id: "EMP-2026-101",
    name: "Mr. Praveen Tyagi",
    gender: "Male",
    designation: "Principal & Academic Director",
    department: "Administration",
    dob: "1980-08-15",
    joining_date: "2012-04-01",
    qualification: "M.Sc. Physics, B.Ed",
    experience_years: "18 Years",
    subjects_taught: "Physics, Administration",
    classes_assigned: "Class XI, Class XII",
    phone: "+91 9829123456",
    email: "principal@stjosephdholpur.com",
    address: "Civil Lines, Near Circuit House, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "O+",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    wishes: "Wishing our beloved Principal a joyful birthday!",
  },
  {
    id: "t2",
    emp_id: "EMP-2026-102",
    name: "Mrs. Sunita Sharma",
    gender: "Female",
    designation: "PGT Mathematics",
    department: "Science & Math",
    dob: "1988-08-02",
    joining_date: "2015-07-10",
    qualification: "M.Sc. Mathematics, B.Ed",
    experience_years: "12 Years",
    subjects_taught: "Mathematics, Calculus",
    classes_assigned: "Class IX, Class X, Class XII",
    phone: "+91 9829134567",
    email: "sunita.sharma@stjosephdholpur.com",
    address: "Ondela Road, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "A+",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    wishes: "May your day be filled with mathematics of joy and happiness!",
  },
  {
    id: "t3",
    emp_id: "EMP-2026-103",
    name: "Mr. Rajesh Verma",
    gender: "Male",
    designation: "TGT English Literature",
    department: "Humanities",
    dob: "1992-08-05",
    joining_date: "2018-06-15",
    qualification: "M.A. English, B.Ed",
    experience_years: "9 Years",
    subjects_taught: "English Language & Grammar",
    classes_assigned: "Class VI, Class VII, Class VIII",
    phone: "+91 9829145678",
    email: "rajesh.verma@stjosephdholpur.com",
    address: "Gulab Bagh, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "B+",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday! Thank you for inspiring our students every day.",
  },
  {
    id: "t4",
    emp_id: "EMP-2026-104",
    name: "Dr. Anil Saxena",
    gender: "Male",
    designation: "PGT Chemistry",
    department: "Science & Math",
    dob: "1984-03-22",
    joining_date: "2014-08-01",
    qualification: "Ph.D Organic Chemistry",
    experience_years: "15 Years",
    subjects_taught: "Chemistry, Practical Chemistry",
    classes_assigned: "Class XI, Class XII",
    phone: "+91 9829156789",
    email: "anil.saxena@stjosephdholpur.com",
    address: "RAC Line Road, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "O+",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    wishes: "Wishing Dr. Saxena a fantastic birthday filled with achievements!",
  },
  {
    id: "t5",
    emp_id: "EMP-2026-105",
    name: "Ms. Priya Gupta",
    gender: "Female",
    designation: "TGT Biology & Science",
    department: "Science & Math",
    dob: "1993-11-14",
    joining_date: "2019-09-01",
    qualification: "M.Sc. Botany, B.Ed",
    experience_years: "7 Years",
    subjects_taught: "Science, Biology, Environment",
    classes_assigned: "Class VII, Class VIII, Class IX",
    phone: "+91 9829167890",
    email: "priya.gupta@stjosephdholpur.com",
    address: "Near Railway Station, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "AB+",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Ms. Priya! Best wishes for the academic year.",
  },
  {
    id: "t6",
    emp_id: "EMP-2026-106",
    name: "Mr. Vikram Singh",
    gender: "Male",
    designation: "Sports & PE Director",
    department: "Sports & PE",
    dob: "1987-05-19",
    joining_date: "2016-04-15",
    qualification: "M.P.Ed, NIS Coach",
    experience_years: "10 Years",
    subjects_taught: "Physical Education, Athletics",
    classes_assigned: "All Classes",
    phone: "+91 9829178901",
    email: "vikram.singh@stjosephdholpur.com",
    address: "Police Lines, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "B+",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Coach Vikram! Keep inspiring champions!",
  },
  {
    id: "t7",
    emp_id: "EMP-2026-107",
    name: "Mrs. Meenakshi Joshi",
    gender: "Female",
    designation: "Primary Class Educator",
    department: "Languages",
    dob: "1994-01-28",
    joining_date: "2020-07-01",
    qualification: "B.A., D.El.Ed",
    experience_years: "6 Years",
    subjects_taught: "Hindi, General Studies",
    classes_assigned: "Class Nursery, Class LKG, Class I",
    phone: "+91 9829189012",
    email: "meenakshi.joshi@stjosephdholpur.com",
    address: "Housing Board Colony, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "O+",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Mrs. Joshi! Thank you for nurturing young minds.",
  },
  {
    id: "t8",
    emp_id: "EMP-2026-108",
    name: "Mr. Suresh Agarwal",
    gender: "Male",
    designation: "PGT Commerce & Accountancy",
    department: "Humanities",
    dob: "1983-09-04",
    joining_date: "2013-08-10",
    qualification: "M.Com, B.Ed, CA Inter",
    experience_years: "14 Years",
    subjects_taught: "Accountancy, Business Studies",
    classes_assigned: "Class XI Commerce, Class XII Commerce",
    phone: "+91 9829190123",
    email: "suresh.agarwal@stjosephdholpur.com",
    address: "Main Market, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "A-",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Mr. Agarwal! Wishing you prosperity and joy.",
  }
];

const initialStudents: Student[] = [
  {
    id: "s1",
    admission_no: "SJ-2026-101",
    form_no: "FORM-2026-8491",
    name: "Aarav Sharma",
    class: "Class X",
    section: "A",
    roll_no: "1001",
    dob: "2010-08-02",
    father_name: "Mr. Rajendra Sharma",
    mother_name: "Mrs. Sunita Sharma",
    parent_mobile: "+91 9829123456",
    whatsapp_no: "+91 9829123456",
    gender: "Male",
    blood_group: "O+",
    category: "General",
    religion: "Hinduism",
    address: "House No. 42, Civil Lines, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Aarav! Wishing you brilliant success in Class 10!",
  },
  {
    id: "s2",
    admission_no: "SJ-2026-102",
    form_no: "FORM-2026-8492",
    name: "Ananya Gupta",
    class: "Class VIII",
    section: "B",
    roll_no: "8042",
    dob: "2012-08-03",
    father_name: "Mr. Vikas Gupta",
    mother_name: "Mrs. Ritu Gupta",
    parent_mobile: "+91 9829134567",
    whatsapp_no: "+91 9829134567",
    gender: "Female",
    blood_group: "A+",
    category: "General",
    religion: "Hinduism",
    address: "Ondela Road, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Ananya! Keep shining bright!",
  },
  {
    id: "s3",
    admission_no: "SJ-2026-103",
    form_no: "FORM-2026-8493",
    name: "Rohan Singh",
    class: "Class XII",
    section: "Science",
    roll_no: "12015",
    dob: "2008-08-06",
    father_name: "Mr. Mahendra Singh",
    mother_name: "Mrs. Pushpa Singh",
    parent_mobile: "+91 9829145678",
    whatsapp_no: "+91 9829145678",
    gender: "Male",
    blood_group: "B+",
    category: "OBC",
    religion: "Hinduism",
    address: "Gulab Bagh, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Rohan! Best wishes for your board year!",
  },
  {
    id: "s4",
    admission_no: "SJ-2026-104",
    form_no: "FORM-2026-8494",
    name: "Ishita Verma",
    class: "Class Nursery",
    section: "A",
    roll_no: "N-101",
    dob: "2022-04-12",
    father_name: "Mr. Alok Verma",
    mother_name: "Mrs. Neha Verma",
    parent_mobile: "+91 9829156789",
    whatsapp_no: "+91 9829156789",
    gender: "Female",
    blood_group: "O+",
    category: "General",
    religion: "Hinduism",
    address: "RAC Line, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday little Ishita! Blessings and love!",
  },
  {
    id: "s5",
    admission_no: "SJ-2026-105",
    form_no: "FORM-2026-8495",
    name: "Vivaan Rajput",
    class: "Class LKG",
    section: "A",
    roll_no: "L-102",
    dob: "2021-06-18",
    father_name: "Mr. Dharmendra Rajput",
    mother_name: "Mrs. Seema Rajput",
    parent_mobile: "+91 9829167890",
    whatsapp_no: "+91 9829167890",
    gender: "Male",
    blood_group: "AB+",
    category: "General",
    religion: "Hinduism",
    address: "Station Road, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Vivaan! Keep smiling!",
  },
  {
    id: "s6",
    admission_no: "SJ-2026-106",
    form_no: "FORM-2026-8496",
    name: "Diya Saxena",
    class: "Class UKG",
    section: "A",
    roll_no: "U-103",
    dob: "2020-09-25",
    father_name: "Dr. Anil Saxena",
    mother_name: "Mrs. Pooja Saxena",
    parent_mobile: "+91 9829178901",
    whatsapp_no: "+91 9829178901",
    gender: "Female",
    blood_group: "B-",
    category: "General",
    religion: "Hinduism",
    address: "Police Line Road, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Diya! Warm greetings!",
  },
  {
    id: "s7",
    admission_no: "SJ-2026-107",
    form_no: "FORM-2026-8497",
    name: "Advait Joshi",
    class: "Class I",
    section: "A",
    roll_no: "101",
    dob: "2019-11-10",
    father_name: "Mr. Sanjay Joshi",
    mother_name: "Mrs. Archana Joshi",
    parent_mobile: "+91 9829189012",
    whatsapp_no: "+91 9829189012",
    gender: "Male",
    blood_group: "O+",
    category: "General",
    religion: "Hinduism",
    address: "Housing Board Colony, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Advait! Best wishes for Class 1!",
  },
  {
    id: "s8",
    admission_no: "SJ-2026-108",
    form_no: "FORM-2026-8498",
    name: "Kavya Agarwal",
    class: "Class II",
    section: "A",
    roll_no: "201",
    dob: "2018-03-05",
    father_name: "Mr. Suresh Agarwal",
    mother_name: "Mrs. Rekha Agarwal",
    parent_mobile: "+91 9829190123",
    whatsapp_no: "+91 9829190123",
    gender: "Female",
    blood_group: "A-",
    category: "General",
    religion: "Hinduism",
    address: "Main Market, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Kavya! Have a wonderful day!",
  },
  {
    id: "s9",
    admission_no: "SJ-2026-109",
    form_no: "FORM-2026-8499",
    name: "Reyansh Chaudhary",
    class: "Class III",
    section: "B",
    roll_no: "305",
    dob: "2017-07-22",
    father_name: "Mr. Ravindra Chaudhary",
    mother_name: "Mrs. Kavita Chaudhary",
    parent_mobile: "+91 9829201234",
    whatsapp_no: "+91 9829201234",
    gender: "Male",
    blood_group: "B+",
    category: "OBC",
    religion: "Hinduism",
    address: "Near Water Tank, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Reyansh!",
  },
  {
    id: "s10",
    admission_no: "SJ-2026-110",
    form_no: "FORM-2026-8500",
    name: "Saanvi Mathur",
    class: "Class IV",
    section: "A",
    roll_no: "402",
    dob: "2016-10-30",
    father_name: "Mr. Hemant Mathur",
    mother_name: "Mrs. Shweta Mathur",
    parent_mobile: "+91 9829212345",
    whatsapp_no: "+91 9829212345",
    gender: "Female",
    blood_group: "O+",
    category: "General",
    religion: "Hinduism",
    address: "Bari Road, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Saanvi!",
  },
  {
    id: "s11",
    admission_no: "SJ-2026-111",
    form_no: "FORM-2026-8501",
    name: "Kanishk Rathore",
    class: "Class V",
    section: "B",
    roll_no: "510",
    dob: "2015-02-14",
    father_name: "Mr. Pratap Rathore",
    mother_name: "Mrs. Suman Rathore",
    parent_mobile: "+91 9829223456",
    whatsapp_no: "+91 9829223456",
    gender: "Male",
    blood_group: "AB-",
    category: "General",
    religion: "Hinduism",
    address: "Rajakhera Bypass, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Kanishk!",
  },
  {
    id: "s12",
    admission_no: "SJ-2026-112",
    form_no: "FORM-2026-8502",
    name: "Navya Tyagi",
    class: "Class VI",
    section: "A",
    roll_no: "601",
    dob: "2014-05-08",
    father_name: "Mr. Praveen Tyagi",
    mother_name: "Mrs. Preeti Tyagi",
    parent_mobile: "+91 9829234567",
    whatsapp_no: "+91 9829234567",
    gender: "Female",
    blood_group: "A+",
    category: "General",
    religion: "Hinduism",
    address: "Civil Lines, Dholpur",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    wishes: "Happy Birthday Navya!",
  }
];

const initialFeeStructure: FeeSection[] = [
  {
    id: "fee-1",
    title: "Pre-Primary (Class Nursery to UKG)",
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
  {
    id: "fee-3",
    title: "Middle & Secondary (Class 6th to 10th)",
    total: "32,500",
    admissionPay: "14,800",
    data: [
      { label: "Registration Fee", amount: "1000" },
      { label: "Admission Fee", amount: "4000" },
      { label: "Lab & Computer Fee", amount: "2500" },
      { label: "Sports & Development", amount: "2000" },
      { label: "Exam & Assessment Fee", amount: "2500" },
      { label: "Tuition Fee (Monthly)", amount: "1700" },
    ],
  }
];

const initialRoutes: TransportRoute[] = [
  {
    id: "r1",
    area: "Dholpur City & Railway Station Route",
    busNo: "RJ-11-PA-101",
    stops: "Gulab Bagh, Ondela Road, Police Line, RAC Line, Railway Station",
    pickupTime: "07:00 AM",
    dropTime: "02:15 PM",
    driverName: "Mr. Ram Singh",
    driverPhone: "+91 98291-11223",
    monthlyFee: "1,200",
    status: "live",
  },
  {
    id: "r2",
    area: "Civil Lines & Circuit House Route",
    busNo: "RJ-11-PA-102",
    stops: "Civil Lines, Circuit House, Collectorate, GT Road, Main Market",
    pickupTime: "07:15 AM",
    dropTime: "02:25 PM",
    driverName: "Mr. Brijesh Sharma",
    driverPhone: "+91 98292-22334",
    monthlyFee: "1,300",
    status: "live",
  },
  {
    id: "r3",
    area: "Ondela Road & RAC Line Route",
    busNo: "RJ-11-PA-103",
    stops: "Ondela Chauraha, RAC Battalion Gate, Water Tank, City Hospital",
    pickupTime: "07:10 AM",
    dropTime: "02:20 PM",
    driverName: "Mr. Satish Kumar",
    driverPhone: "+91 98293-33445",
    monthlyFee: "1,250",
    status: "live",
  },
  {
    id: "r4",
    area: "Bari Road & Housing Board Route",
    busNo: "RJ-11-PA-104",
    stops: "Bari Road, Housing Board Colony, Rajakhera Bypass, Sai Mandir",
    pickupTime: "07:20 AM",
    dropTime: "02:30 PM",
    driverName: "Mr. Jaswant Gurjar",
    driverPhone: "+91 98294-44556",
    monthlyFee: "1,400",
    status: "live",
  }
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
  {
    id: "tc-2",
    roll_no: "12004",
    class: "Class XII",
    student_name: "Priya Chhabra",
    father_name: "Sunil Chhabra",
    dob: "2008-03-12",
    tc_number: "TC-2026-002",
    issue_date: "2026-05-18",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "tc-3",
    roll_no: "8012",
    class: "Class VIII",
    student_name: "Hardik Meena",
    father_name: "Mohan Meena",
    dob: "2012-11-05",
    tc_number: "TC-2026-003",
    issue_date: "2026-05-20",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "tc-4",
    roll_no: "5009",
    class: "Class V",
    student_name: "Sneha Khandelwal",
    father_name: "Rakesh Khandelwal",
    dob: "2015-09-18",
    tc_number: "TC-2026-004",
    issue_date: "2026-05-25",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "tc-5",
    roll_no: "1045",
    class: "Class X",
    student_name: "Rahul Yadav",
    father_name: "Brijesh Yadav",
    dob: "2010-01-30",
    tc_number: "TC-2026-005",
    issue_date: "2026-06-02",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  }
];

function cleanPayload(record: any) {
  const { id, ...rest } = record;
  const isUuid = id && typeof id === "string" && id.includes("-") && id.length > 25;
  return isUuid ? record : rest;
}

// ─── API Services (100% Direct Supabase Cloud Operations) ────────────────────

// 1. TC Service
export async function fetchTCs(): Promise<TCRecordData[]> {
  try {
    const { data, error } = await supabase.from("tc_records").select("*").order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchTCs error", e);
  }
  return [];
}

export async function uploadAndSaveTC(
  file: File | null,
  record: Omit<TCRecordData, "id" | "file_path" | "file_url" | "created_at">
): Promise<TCRecordData> {
  let file_url = "";
  let file_path = "";

  if (file) {
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
      console.warn("Storage upload error", e);
    }
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
    const { data } = await supabase.from("tc_records").insert([dbPayload]).select().single();
    if (data?.id) {
      newRecord.id = data.id;
    }
  } catch (e) {
    console.warn("Supabase TC insert error", e);
  }

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

  try {
    await supabase.from("tc_records").upsert([newRecord]);
  } catch (e) {
    console.warn("Supabase saveTCRecord error", e);
  }

  return newRecord;
}

export async function deleteTCRecord(id: string): Promise<void> {
  try {
    await supabase.from("tc_records").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteTCRecord error", e);
  }
}

// 2. Teachers Service
export async function fetchTeachers(): Promise<Teacher[]> {
  try {
    const { data, error } = await supabase.from("teachers").select("*").order("name");
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchTeachers error", e);
  }
  return [];
}

export async function saveTeacherRecord(t: Omit<Teacher, "id"> & { id?: string }): Promise<Teacher> {
  const record: Teacher = {
    ...t,
    id: t.id || `t_${Date.now()}`,
    emp_id: t.emp_id || `EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
    name: t.name,
    gender: t.gender || "Male",
    designation: t.designation || "PGT Teacher",
    department: t.department || "General",
    dob: t.dob || "1990-01-01",
    joining_date: t.joining_date || new Date().toISOString().split("T")[0],
    photo_url: t.photo_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    email: t.email || "",
    phone: t.phone || "",
    is_active: t.is_active ?? true,
    wishes: t.wishes || "Happy Birthday!",
    created_at: t.created_at || new Date().toISOString(),
  };

  try {
    const dbPayload: any = cleanPayload(record);
    if (t.id && !t.id.startsWith("t_")) {
      dbPayload.id = t.id;
    } else {
      delete dbPayload.id;
    }

    const { data, error } = await supabase.from("teachers").upsert([dbPayload]).select();
    if (error) {
      console.error("Supabase teacher save error:", error);
    } else if (data && data[0]?.id) {
      record.id = data[0].id;
    }
  } catch (e: any) {
    console.error("Supabase teacher save exception:", e);
  }

  return record;
}

export async function deleteTeacherRecord(id: string): Promise<void> {
  try {
    await supabase.from("teachers").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteTeacherRecord error", e);
  }
}

// 3. Students Service
export async function fetchStudents(): Promise<Student[]> {
  try {
    const { data, error } = await supabase.from("students").select("*").order("name");
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchStudents error", e);
  }
  return [];
}

export async function saveStudentRecord(s: Omit<Student, "id"> & { id?: string }): Promise<Student> {
  const record: Student = {
    ...s,
    id: s.id || `s_${Date.now()}`,
    name: s.name || s.student_name || "Student",
    student_name: s.student_name || s.name,
    admission_no: s.admission_no || s.roll_no || `SJ-${Date.now().toString().slice(-4)}`,
    form_no: s.form_no || `FORM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    session: s.session || "2026-2027",
    class: s.class || "Class Nursery",
    section: s.section || "A",
    roll_no: s.roll_no || "",
    dob: s.dob || "2020-01-01",
    father_name: s.father_name || "",
    mother_name: s.mother_name || "",
    parent_mobile: s.parent_mobile || s.whatsapp_no || "",
    address: s.address || "",
    photo_url: s.photo_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    active_status: s.active_status ?? true,
    wishes: s.wishes || "Happy Birthday!",
    created_at: s.created_at || new Date().toISOString(),
  };

  try {
    const dbPayload: any = cleanPayload(record);
    if (s.id && !s.id.startsWith("s_")) {
      dbPayload.id = s.id;
    } else {
      delete dbPayload.id;
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

  return record;
}

export async function deleteStudentRecord(id: string): Promise<void> {
  try {
    await supabase.from("students").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteStudentRecord error", e);
  }
}

// 4. Fees Service
export async function fetchFeeStructure(): Promise<FeeSection[]> {
  try {
    const { data, error } = await supabase.from("fee_structure").select("*");
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn("Supabase fetchFeeStructure error", e);
  }
  return initialFeeStructure;
}

export async function saveFeeStructure(sections: FeeSection[]): Promise<void> {
  try {
    await supabase.from("fee_structure").upsert(sections);
  } catch (e) {
    console.warn("Supabase saveFeeStructure error", e);
  }
}

// 5. Transport Service
export async function fetchTransportRoutes(): Promise<TransportRoute[]> {
  try {
    const { data, error } = await supabase.from("transportation").select("*");
    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        area: d.area,
        busNo: d.busNo || d.busno || "",
        stops: d.stops,
        pickupTime: d.pickupTime || d.pickuptime || "",
        dropTime: d.dropTime || d.droptime || "02:30 PM",
        driverName: d.driverName || d.drivername || "Driver",
        driverPhone: d.driverPhone || d.driverphone || "",
        monthlyFee: d.monthlyFee || d.monthlyfee || "1,200",
        status: d.status || "active"
      }));
    }
  } catch (e) {
    console.warn("Supabase fetchTransportRoutes error", e);
  }
  return [];
}

export async function saveTransportRoute(r: Omit<TransportRoute, "id"> & { id?: string }): Promise<TransportRoute> {
  const payload: any = {
    area: r.area,
    "busNo": r.busNo,
    stops: r.stops,
    "pickupTime": r.pickupTime,
    "dropTime": r.dropTime || "02:30 PM",
    "driverName": r.driverName || "Driver",
    "driverPhone": r.driverPhone || "+91-88245-51683",
    "monthlyFee": r.monthlyFee || "1,200",
    status: r.status || "active",
  };

  if (r.id && !r.id.startsWith("r_")) {
    payload.id = r.id;
  }

  try {
    const { data, error } = await supabase.from("transportation").upsert([payload]).select().single();
    if (error) console.warn("Supabase transport save error:", error);
    if (data?.id) return { ...r, id: data.id };
  } catch (e) {
    console.warn("Supabase saveTransportRoute exception", e);
  }

  return { ...r, id: r.id || `r_${Date.now()}` };
}

export async function deleteTransportRoute(id: string): Promise<void> {
  try {
    await supabase.from("transportation").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteTransportRoute error", e);
  }
}

// 6. Mandatory Docs Service
export async function fetchMandatoryDocs(): Promise<MandatoryDoc[]> {
  try {
    const { data, error } = await supabase.from("mandatory_disclosures").select("*");
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchMandatoryDocs error", e);
  }
  return [];
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
  try {
    const payload = cleanPayload(record);
    const { data, error } = await supabase.from("mandatory_disclosures").upsert([payload]).select().single();
    if (error) console.warn("Supabase disclosure save error:", error);
    if (data?.id) record.id = data.id;
  } catch (e) {
    console.warn("Supabase saveMandatoryDoc exception", e);
  }
  return record;
}

export async function deleteMandatoryDoc(id: string): Promise<void> {
  try {
    await supabase.from("mandatory_disclosures").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteMandatoryDoc error", e);
  }
}

// 7. News Service
export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchNews error", e);
  }
  return [];
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
  try {
    const payload = cleanPayload(record);
    const { data, error } = await supabase.from("news").upsert([payload]).select().single();
    if (error) console.warn("Supabase news save error:", error);
    if (data?.id) record.id = data.id;
  } catch (e) {
    console.warn("Supabase saveNews exception", e);
  }
  return record;
}

export async function deleteNews(id: string): Promise<void> {
  try {
    await supabase.from("news").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteNews error", e);
  }
}

// 8. Events Service
export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchEvents error", e);
  }
  return [];
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
  try {
    const payload = cleanPayload(record);
    const { data, error } = await supabase.from("events").upsert([payload]).select().single();
    if (error) console.warn("Supabase events save error:", error);
    if (data?.id) record.id = data.id;
  } catch (e) {
    console.warn("Supabase saveEvent exception", e);
  }
  return record;
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await supabase.from("events").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteEvent error", e);
  }
}

export const initialBooks: BookItem[] = [
  { id: "bk_n1", class_name: "Class Nursery", subject: "English", book_title: "Alphabet World & Phonics Picture Book", publisher: "WonderKids Press" },
  { id: "bk_n2", class_name: "Class Nursery", subject: "Mathematics", book_title: "My First Number Book (1-20)", publisher: "WonderKids Press" },
  { id: "bk_l1", class_name: "Class LKG", subject: "English", book_title: "Early Steps English Reader & Writing", publisher: "S. Chand" },
  { id: "bk_l2", class_name: "Class LKG", subject: "Mathematics", book_title: "Pre-School Maths (1-50)", publisher: "S. Chand" },
  { id: "bk_u1", class_name: "Class UKG", subject: "English", book_title: "Senior Kindergarten Literacy Skills", publisher: "Oxford Press" },
  { id: "bk_u2", class_name: "Class UKG", subject: "Mathematics", book_title: "Senior Kindergarten Numeracy Skills (1-100)", publisher: "Oxford Press" },
  { id: "bk_u3", class_name: "Class UKG", subject: "EVS / General Awareness", book_title: "Environmental Studies for Beginners", publisher: "Oxford Press" },

  { id: "bk_1_1", class_name: "Class I", subject: "English", book_title: "Mridang - English Textbook for Class 1", publisher: "NCERT" },
  { id: "bk_1_2", class_name: "Class I", subject: "Mathematics", book_title: "Joyful Mathematics - Class 1", publisher: "NCERT" },
  { id: "bk_1_3", class_name: "Class I", subject: "Hindi", book_title: "Sarangi - Hindi Reader Class 1", publisher: "NCERT" },
  { id: "bk_2_1", class_name: "Class II", subject: "English", book_title: "Mridang - English Reader Class 2", publisher: "NCERT" },
  { id: "bk_2_2", class_name: "Class II", subject: "Mathematics", book_title: "Joyful Mathematics - Class 2", publisher: "NCERT" },
  { id: "bk_2_3", class_name: "Class II", subject: "Hindi", book_title: "Sarangi - Hindi Reader Class 2", publisher: "NCERT" },
  { id: "bk_3_1", class_name: "Class III", subject: "English", book_title: "Santoor - English Reader Class 3", publisher: "NCERT" },
  { id: "bk_3_2", class_name: "Class III", subject: "Mathematics", book_title: "Math-Magic Book 3", publisher: "NCERT" },
  { id: "bk_3_3", class_name: "Class III", subject: "EVS", book_title: "Looking Around - EVS Class 3", publisher: "NCERT" },
  { id: "bk_4_1", class_name: "Class IV", subject: "English", book_title: "Marigold - English Reader Book 4", publisher: "NCERT" },
  { id: "bk_4_2", class_name: "Class IV", subject: "Mathematics", book_title: "Math-Magic Book 4", publisher: "NCERT" },
  { id: "bk_4_3", class_name: "Class IV", subject: "EVS", book_title: "Looking Around - EVS Book 4", publisher: "NCERT" },
  { id: "bk_5_1", class_name: "Class V", subject: "English", book_title: "Marigold - English Reader Book 5", publisher: "NCERT" },
  { id: "bk_5_2", class_name: "Class V", subject: "Mathematics", book_title: "Math-Magic Book 5", publisher: "NCERT" },
  { id: "bk_5_3", class_name: "Class V", subject: "EVS", book_title: "Looking Around - EVS Book 5", publisher: "NCERT" },

  { id: "bk_6_1", class_name: "Class VI", subject: "English", book_title: "Poorvi - English Reader Class 6", publisher: "NCERT" },
  { id: "bk_6_2", class_name: "Class VI", subject: "Mathematics", book_title: "Ganita Prakash - Mathematics Class 6", publisher: "NCERT" },
  { id: "bk_6_3", class_name: "Class VI", subject: "Science", book_title: "Curiosity - Science Reader Class 6", publisher: "NCERT" },
  { id: "bk_6_4", class_name: "Class VI", subject: "Social Science", book_title: "Exploring Society: India and Beyond", publisher: "NCERT" },
  { id: "bk_7_1", class_name: "Class VII", subject: "English", book_title: "Honeycomb - English Reader Class 7", publisher: "NCERT" },
  { id: "bk_7_2", class_name: "Class VII", subject: "Mathematics", book_title: "Mathematics Textbook for Class 7", publisher: "NCERT" },
  { id: "bk_7_3", class_name: "Class VII", subject: "Science", book_title: "Science Textbook for Class 7", publisher: "NCERT" },
  { id: "bk_8_1", class_name: "Class VIII", subject: "English", book_title: "Honeydew - English Reader Class 8", publisher: "NCERT" },
  { id: "bk_8_2", class_name: "Class VIII", subject: "Mathematics", book_title: "Mathematics Textbook for Class 8", publisher: "NCERT" },
  { id: "bk_8_3", class_name: "Class VIII", subject: "Science", book_title: "Science Textbook for Class 8", publisher: "NCERT" },
  { id: "bk_8_4", class_name: "Class VIII", subject: "Social Science", book_title: "Our Pasts III & Resource & Development", publisher: "NCERT" },

  { id: "bk_9_1", class_name: "Class IX", subject: "English", book_title: "Beehive & Moments Supplementary Reader", publisher: "NCERT" },
  { id: "bk_9_2", class_name: "Class IX", subject: "Mathematics", book_title: "Mathematics Textbook for Class 9", publisher: "NCERT" },
  { id: "bk_9_3", class_name: "Class IX", subject: "Science", book_title: "Science Textbook for Class 9", publisher: "NCERT" },
  { id: "bk_9_4", class_name: "Class IX", subject: "Social Science", book_title: "India & Contemporary World I & Economics", publisher: "NCERT" },
  { id: "bk_10_1", class_name: "Class X", subject: "Mathematics", book_title: "Mathematics Textbook for Class 10", publisher: "NCERT" },
  { id: "bk_10_2", class_name: "Class X", subject: "Science", book_title: "Science & Technology Textbook Class 10", publisher: "NCERT" },
  { id: "bk_10_3", class_name: "Class X", subject: "English", book_title: "First Flight & Footprints Without Feet", publisher: "NCERT" },
  { id: "bk_10_4", class_name: "Class X", subject: "Social Science", book_title: "India & Contemporary World II & Democratic Politics", publisher: "NCERT" },
  { id: "bk_10_5", class_name: "Class X", subject: "Hindi", book_title: "Kshitij Part 2 & Sparsh Part 2", publisher: "NCERT" },

  { id: "bk_11_s1", class_name: "Class XI (Science)", subject: "Physics", book_title: "Physics Part I & II Class 11", publisher: "NCERT" },
  { id: "bk_11_s2", class_name: "Class XI (Science)", subject: "Chemistry", book_title: "Chemistry Part I & II Class 11", publisher: "NCERT" },
  { id: "bk_11_s3", class_name: "Class XI (Science)", subject: "Mathematics", book_title: "Mathematics Textbook Class 11", publisher: "NCERT" },
  { id: "bk_11_c1", class_name: "Class XI (Commerce)", subject: "Accountancy", book_title: "Financial Accounting Part I Class 11", publisher: "NCERT" },
  { id: "bk_11_c2", class_name: "Class XI (Commerce)", subject: "Business Studies", book_title: "Business Studies Class 11", publisher: "NCERT" },
  { id: "bk_12_s1", class_name: "Class XII (Science)", subject: "Physics", book_title: "Physics Part I & II Class 12", publisher: "NCERT" },
  { id: "bk_12_s2", class_name: "Class XII (Science)", subject: "Chemistry", book_title: "Chemistry Part I & II Class 12", publisher: "NCERT" },
  { id: "bk_12_s3", class_name: "Class XII (Science)", subject: "Mathematics", book_title: "Mathematics Part I & II Class 12", publisher: "NCERT" },
  { id: "bk_12_c1", class_name: "Class XII (Commerce)", subject: "Accountancy", book_title: "Accountancy Part I & II Class 12", publisher: "NCERT" },
  { id: "bk_12_c2", class_name: "Class XII (Commerce)", subject: "Business Studies", book_title: "Business Studies Part I & II Class 12", publisher: "NCERT" }
];

// 9. Books Service
export async function fetchBooks(): Promise<BookItem[]> {
  try {
    const { data, error } = await supabase.from("books").select("*");
    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        id: b.id,
        class_name: b.class_name || b.class || b.className || "Class X",
        subject: b.subject || "General",
        book_title: b.book_title || b.title || b.name || "Textbook",
        publisher: b.publisher || "NCERT / Standard"
      }));
    }
  } catch (e) {
    console.warn("Supabase fetchBooks error", e);
  }
  return initialBooks;
}

export async function saveBook(item: Omit<BookItem, "id"> & { id?: string }): Promise<BookItem> {
  const payload: any = {
    class_name: item.class_name,
    subject: item.subject,
    book_title: item.book_title,
    publisher: item.publisher || "NCERT / Standard",
  };

  if (item.id && !item.id.startsWith("bk_")) {
    payload.id = item.id;
  }

  try {
    const { data, error } = await supabase.from("books").upsert([payload]).select().single();
    if (error) console.warn("Supabase books save error:", error);
    if (data?.id) return { ...item, id: data.id };
  } catch (e) {
    console.warn("Supabase saveBook exception", e);
  }
  return { ...item, id: item.id || `bk_${Date.now()}` };
}

export async function deleteBook(id: string): Promise<void> {
  try {
    await supabase.from("books").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteBook error", e);
  }
}

// 10. Achievements Service
export async function fetchAchievements(): Promise<AchievementItem[]> {
  try {
    const { data, error } = await supabase.from("achievements").select("*").order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchAchievements error", e);
  }
  return [];
}

export async function saveAchievement(item: Omit<AchievementItem, "id"> & { id?: string }): Promise<AchievementItem> {
  const record: AchievementItem = {
    id: item.id || `ach_${Date.now()}`,
    title: item.title,
    category: item.category || "Excellence",
    year: item.year || new Date().getFullYear().toString(),
    description: item.description || "",
  };
  try {
    const payload = cleanPayload(record);
    const { data, error } = await supabase.from("achievements").upsert([payload]).select().single();
    if (error) console.warn("Supabase achievements save error:", error);
    if (data?.id) record.id = data.id;
  } catch (e) {
    console.warn("Supabase saveAchievement exception", e);
  }
  return record;
}

export async function deleteAchievement(id: string): Promise<void> {
  try {
    await supabase.from("achievements").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteAchievement error", e);
  }
}

// Supabase Storage Bucket Helper for 10x Fast CDN Image Loading
export async function uploadImageToSupabaseStorage(dataUrlOrFile: string | File, bucketName = "gallery"): Promise<string> {
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
    console.warn("Supabase Storage upload exception:", err);
  }

  return typeof dataUrlOrFile === "string" ? dataUrlOrFile : "";
}

// 11. Gallery Service
export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase.from("gallery").select("*");
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchGallery error", e);
  }
  return [];
}

export async function saveGallery(item: Omit<GalleryItem, "id"> & { id?: string }): Promise<GalleryItem> {
  let finalImageUrl = item.image_url;

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
  try {
    const payload = cleanPayload(record);
    const { data, error } = await supabase.from("gallery").upsert([payload]).select().single();
    if (error) console.warn("Supabase gallery save error:", error);
    if (data?.id) record.id = data.id;
  } catch (e) {
    console.warn("Supabase saveGallery exception", e);
  }
  return record;
}

export async function deleteGallery(id: string): Promise<void> {
  try {
    await supabase.from("gallery").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteGallery error", e);
  }
}

// 12. Calendar Service
export async function fetchCalendar(): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase.from("calendar").select("*").order("date", { ascending: true });
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchCalendar error", e);
  }
  return [];
}

export async function saveCalendar(item: Omit<CalendarEvent, "id"> & { id?: string }): Promise<CalendarEvent> {
  const record: CalendarEvent = {
    id: item.id || `cal_${Date.now()}`,
    title: item.title,
    date: item.date,
    category: item.category || "Academic",
    description: item.description || "",
  };
  try {
    const payload = cleanPayload(record);
    const { data, error } = await supabase.from("calendar").upsert([payload]).select().single();
    if (error) console.warn("Supabase calendar save error:", error);
    if (data?.id) record.id = data.id;
  } catch (e) {
    console.warn("Supabase saveCalendar exception", e);
  }
  return record;
}

export async function deleteCalendar(id: string): Promise<void> {
  try {
    await supabase.from("calendar").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteCalendar error", e);
  }
}

// 13. Attendance Service
export async function fetchAttendance(date?: string, className?: string): Promise<AttendanceRecord[]> {
  try {
    let query = supabase.from("attendance").select("*");
    if (date) query = query.eq("date", date);
    if (className) query = query.eq("class", className);
    const { data, error } = await query;
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchAttendance error", e);
  }
  return [];
}

export async function saveAttendanceRecords(records: AttendanceRecord[]): Promise<void> {
  try {
    const payloads = records.map((r) => cleanPayload(r));
    await supabase.from("attendance").upsert(payloads);
  } catch (e) {
    console.warn("Supabase saveAttendanceRecords error", e);
  }
}

// 14. Exam Marks Service
export async function fetchExamMarks(examName?: string, className?: string): Promise<ExamMarkRecord[]> {
  try {
    let query = supabase.from("marks").select("*");
    if (examName) query = query.eq("exam_name", examName);
    if (className) query = query.eq("class", className);
    const { data, error } = await query;
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchExamMarks error", e);
  }
  return [];
}

export async function saveExamMarksRecords(records: ExamMarkRecord[]): Promise<void> {
  try {
    const payloads = records.map((r) => cleanPayload(r));
    await supabase.from("marks").upsert(payloads);
  } catch (e) {
    console.warn("Supabase saveExamMarksRecords error", e);
  }
}

// 15. Fee Collections Service
export async function fetchFeeCollections(): Promise<FeeReceiptRecord[]> {
  try {
    const { data, error } = await supabase.from("fee_collections").select("*").order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch (e) {
    console.warn("Supabase fetchFeeCollections error", e);
  }
  return [];
}

export async function saveFeeCollectionRecord(receipt: Omit<FeeReceiptRecord, "id" | "receipt_no" | "created_at" | "payment_date"> & { id?: string; receipt_no?: string; payment_date?: string }): Promise<FeeReceiptRecord> {
  const newReceipt: FeeReceiptRecord = {
    id: receipt.id || `rec_${Date.now()}`,
    receipt_no: receipt.receipt_no || `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    student_id: receipt.student_id,
    student_name: receipt.student_name,
    class: receipt.class,
    amount_paid: Number(receipt.amount_paid),
    payment_mode: receipt.payment_mode || "Cash",
    transaction_id: receipt.transaction_id || "",
    payment_date: receipt.payment_date || new Date().toISOString().split("T")[0],
    collected_by: receipt.collected_by || "Admin",
    remarks: receipt.remarks || "",
    created_at: new Date().toISOString(),
  };

  try {
    const payload = cleanPayload(newReceipt);
    const { data } = await supabase.from("fee_collections").upsert([payload]).select().single();
    if (data?.id) newReceipt.id = data.id;
  } catch (e) {
    console.warn("Supabase saveFeeCollectionRecord error", e);
  }
  return newReceipt;
}

export const initialClasses: ClassEntity[] = [
  { id: "cls_0", name: "Class PG", code: "PG", stream: "General", display_order: 1, is_active: true },
  { id: "cls_1", name: "Class Nursery", code: "NUR", stream: "General", display_order: 2, is_active: true },
  { id: "cls_2", name: "Class LKG", code: "LKG", stream: "General", display_order: 3, is_active: true },
  { id: "cls_3", name: "Class UKG", code: "UKG", stream: "General", display_order: 4, is_active: true },
  { id: "cls_4", name: "Class I", code: "1", stream: "General", display_order: 5, is_active: true },
  { id: "cls_5", name: "Class II", code: "2", stream: "General", display_order: 6, is_active: true },
  { id: "cls_6", name: "Class III", code: "3", stream: "General", display_order: 7, is_active: true },
  { id: "cls_7", name: "Class IV", code: "4", stream: "General", display_order: 8, is_active: true },
  { id: "cls_8", name: "Class V", code: "5", stream: "General", display_order: 9, is_active: true },
  { id: "cls_9", name: "Class VI", code: "6", stream: "General", display_order: 10, is_active: true },
  { id: "cls_10", name: "Class VII", code: "7", stream: "General", display_order: 11, is_active: true },
  { id: "cls_11", name: "Class VIII", code: "8", stream: "General", display_order: 12, is_active: true },
  { id: "cls_12", name: "Class IX", code: "9", stream: "General", display_order: 13, is_active: true },
  { id: "cls_13", name: "Class X", code: "10", stream: "General", display_order: 14, is_active: true },
  { id: "cls_14", name: "Class XI (Science)", code: "11-SCI", stream: "Science", display_order: 15, is_active: true },
  { id: "cls_15", name: "Class XI (Commerce)", code: "11-COM", stream: "Commerce", display_order: 16, is_active: true },
  { id: "cls_16", name: "Class XI (Arts)", code: "11-ART", stream: "Arts", display_order: 17, is_active: true },
  { id: "cls_17", name: "Class XII (Science)", code: "12-SCI", stream: "Science", display_order: 18, is_active: true },
  { id: "cls_18", name: "Class XII (Commerce)", code: "12-COM", stream: "Commerce", display_order: 19, is_active: true },
  { id: "cls_19", name: "Class XII (Arts)", code: "12-ART", stream: "Arts", display_order: 20, is_active: true }
];

export async function fetchClasses(): Promise<ClassEntity[]> {
  try {
    const { data, error } = await supabase.from("classes").select("*").order("display_order", { ascending: true });
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn("Supabase fetchClasses error", e);
  }
  return initialClasses;
}

export async function saveClass(item: Omit<ClassEntity, "id"> & { id?: string }): Promise<ClassEntity> {
  const payload: any = {
    name: item.name,
    code: item.code || item.name.replace(/class/i, "").trim(),
    stream: item.stream || "General",
    display_order: item.display_order ?? 99,
    is_active: item.is_active ?? true
  };

  if (item.id && !item.id.startsWith("cls_")) {
    payload.id = item.id;
  }

  try {
    const { data, error } = await supabase.from("classes").upsert([payload]).select().single();
    if (error) console.warn("Supabase class save error:", error);
    if (data?.id) return { ...item, id: data.id };
  } catch (e) {
    console.warn("Supabase saveClass exception", e);
  }
  return { ...item, id: item.id || `cls_${Date.now()}` };
}

export async function deleteClass(id: string): Promise<void> {
  try {
    await supabase.from("classes").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase deleteClass error", e);
  }
}
