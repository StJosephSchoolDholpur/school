-- ============================================================================
-- ST. JOSEPH'S SCHOOL - DATABASE MOCK DATA SEED SCRIPT
-- Copy & Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- 1. ENSURE TABLES EXIST WITH ALL COLUMNS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_no TEXT,
    form_no TEXT,
    session TEXT DEFAULT '2026-2027',
    name TEXT NOT NULL,
    student_name TEXT,
    class TEXT NOT NULL,
    section TEXT DEFAULT 'A',
    roll_no TEXT,
    dob DATE NOT NULL,
    age_march31 TEXT,
    blood_group TEXT,
    nationality TEXT DEFAULT 'Indian',
    religion TEXT DEFAULT 'Hinduism',
    category TEXT DEFAULT 'General',
    gender TEXT,
    medical_condition TEXT,
    address TEXT,
    city_state TEXT DEFAULT 'Dholpur, Rajasthan',
    pincode TEXT DEFAULT '328001',
    whatsapp_no TEXT,
    parent_mobile TEXT,
    mother_name TEXT,
    mother_age TEXT,
    mother_qualification TEXT,
    mother_profession TEXT,
    mother_city_state TEXT,
    mother_whatsapp TEXT,
    mother_email TEXT,
    father_name TEXT,
    father_age TEXT,
    father_qualification TEXT,
    father_profession TEXT,
    father_city_state TEXT,
    father_whatsapp TEXT,
    father_email TEXT,
    previous_school_name TEXT,
    previous_class TEXT,
    previous_medium TEXT,
    previous_board TEXT,
    previous_school_address TEXT,
    previous_marks TEXT,
    has_sibling BOOLEAN DEFAULT FALSE,
    sibling_name TEXT,
    sibling_admission_no TEXT,
    sibling_class TEXT,
    date_of_admission DATE DEFAULT CURRENT_DATE,
    transport_required BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    active_status BOOLEAN DEFAULT TRUE,
    wishes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emp_id TEXT UNIQUE,
    name TEXT NOT NULL,
    gender TEXT,
    designation TEXT NOT NULL,
    department TEXT,
    dob DATE NOT NULL,
    joining_date DATE DEFAULT CURRENT_DATE,
    qualification TEXT,
    experience_years TEXT,
    subjects_taught TEXT,
    classes_assigned TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city_state TEXT DEFAULT 'Dholpur, Rajasthan',
    pincode TEXT DEFAULT '328001',
    blood_group TEXT,
    aadhaar_no TEXT,
    pan_no TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    pay_grade TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    photo_url TEXT,
    wishes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_no TEXT,
    class TEXT NOT NULL,
    student_name TEXT NOT NULL,
    father_name TEXT,
    dob TEXT,
    tc_number TEXT UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    file_path TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Re-create transportation table with double-quoted identifiers for camelCase fields
DROP TABLE IF EXISTS public.transportation CASCADE;

CREATE TABLE public.transportation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area TEXT NOT NULL,
    "busNo" TEXT NOT NULL,
    stops TEXT,
    "pickupTime" TEXT,
    "dropTime" TEXT,
    "driverName" TEXT,
    "driverPhone" TEXT,
    "monthlyFee" TEXT,
    status TEXT DEFAULT 'live',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attendance (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT,
    class TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Leave')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLEAR PREVIOUS SEED DATA TO PREVENT DUPLICATES
TRUNCATE TABLE public.students, public.teachers, public.tc_records CASCADE;

-- 3. INSERT MOCK STUDENTS (Includes Student with TODAY'S DOB for WhatsApp Birthday Testing!)
-- Note: (CURRENT_DATE - INTERVAL '16 years')::date sets DOB to today's month/day so WhatsApp Birthday Automation triggers!
INSERT INTO public.students (
    admission_no, form_no, name, student_name, class, section, roll_no, dob, 
    father_name, mother_name, parent_mobile, whatsapp_no, gender, blood_group, category, religion, 
    address, city_state, pincode, photo_url, wishes
) VALUES
(
    'SJ-2026-101', 'FORM-2026-8491', 'Aarav Sharma', 'Aarav Sharma', 'Class X', 'A', '1001', 
    -- TODAY'S BIRTHDAY FOR WHATSAPP AUTOMATION TESTING!
    (CURRENT_DATE - INTERVAL '16 years')::date,
    'Mr. Rajendra Sharma', 'Mrs. Sunita Sharma', '+919829123456', '+919829123456', 'Male', 'O+', 'General', 'Hinduism',
    'House No. 42, Civil Lines, Dholpur', 'Dholpur, Rajasthan', '328001',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday Aarav! Wishing you brilliant success in Class 10!'
),
(
    'SJ-2026-102', 'FORM-2026-8492', 'Ananya Gupta', 'Ananya Gupta', 'Class VIII', 'B', '8042', 
    '2012-08-15',
    'Mr. Vikas Gupta', 'Mrs. Ritu Gupta', '+919829134567', '+919829134567', 'Female', 'A+', 'General', 'Hinduism',
    'Ondela Road, Dholpur', 'Dholpur, Rajasthan', '328001',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday Ananya! Keep shining bright!'
),
(
    'SJ-2026-103', 'FORM-2026-8493', 'Rohan Singh', 'Rohan Singh', 'Class XII', 'Science', '12015', 
    '2008-08-20',
    'Mr. Mahendra Singh', 'Mrs. Pushpa Singh', '+919829145678', '+919829145678', 'Male', 'B+', 'OBC', 'Hinduism',
    'Gulab Bagh, Dholpur', 'Dholpur, Rajasthan', '328001',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday Rohan! Best wishes for your board year!'
),
(
    'SJ-2026-104', 'FORM-2026-8494', 'Ishita Verma', 'Ishita Verma', 'Class Nursery', 'A', 'N-101', 
    '2022-04-12',
    'Mr. Alok Verma', 'Mrs. Neha Verma', '+919829156789', '+919829156789', 'Female', 'O+', 'General', 'Hinduism',
    'RAC Line, Dholpur', 'Dholpur, Rajasthan', '328001',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday little Ishita! Blessings and love!'
),
(
    'SJ-2026-105', 'FORM-2026-8495', 'Vivaan Rajput', 'Vivaan Rajput', 'Class LKG', 'A', 'L-102', 
    '2021-06-18',
    'Mr. Dharmendra Rajput', 'Mrs. Seema Rajput', '+919829167890', '+919829167890', 'Male', 'AB+', 'General', 'Hinduism',
    'Station Road, Dholpur', 'Dholpur, Rajasthan', '328001',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday Vivaan! Keep smiling!'
),
(
    'SJ-2026-106', 'FORM-2026-8496', 'Diya Saxena', 'Diya Saxena', 'Class UKG', 'A', 'U-103', 
    '2020-09-25',
    'Dr. Anil Saxena', 'Mrs. Pooja Saxena', '+919829178901', '+919829178901', 'Female', 'B-', 'General', 'Hinduism',
    'Police Line Road, Dholpur', 'Dholpur, Rajasthan', '328001',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday Diya! Warm greetings!'
),
(
    'SJ-2026-107', 'FORM-2026-8497', 'Advait Joshi', 'Advait Joshi', 'Class I', 'A', '101', 
    '2019-11-10',
    'Mr. Sanjay Joshi', 'Mrs. Archana Joshi', '+919829189012', '+919829189012', 'Male', 'O+', 'General', 'Hinduism',
    'Housing Board Colony, Dholpur', 'Dholpur, Rajasthan', '328001',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday Advait! Best wishes for Class 1!'
),
(
    'SJ-2026-108', 'FORM-2026-8498', 'Kavya Agarwal', 'Kavya Agarwal', 'Class II', 'A', '201', 
    '2018-03-05',
    'Mr. Suresh Agarwal', 'Mrs. Rekha Agarwal', '+919829190123', '+919829190123', 'Female', 'A-', 'General', 'Hinduism',
    'Main Market, Dholpur', 'Dholpur, Rajasthan', '328001',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday Kavya! Have a wonderful day!'
);

-- 4. INSERT MOCK TEACHERS (Includes Teacher with TODAY'S DOB for Testing!)
INSERT INTO public.teachers (
    emp_id, name, gender, designation, department, dob, joining_date, 
    qualification, experience_years, subjects_taught, classes_assigned, phone, email, 
    address, city_state, pincode, blood_group, is_active, photo_url, wishes
) VALUES
(
    'EMP-2026-101', 'Mr. Praveen Tyagi', 'Male', 'Principal & Academic Director', 'Administration', 
    '1980-08-15', '2012-04-01', 'M.Sc. Physics, B.Ed', '18 Years', 'Physics, Administration', 'Class XI, Class XII', 
    '+919829123456', 'principal@stjosephdholpur.com', 'Civil Lines, Near Circuit House, Dholpur', 'Dholpur, Rajasthan', '328001', 'O+', TRUE,
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    'Wishing our beloved Principal a joyful birthday!'
),
(
    'EMP-2026-102', 'Mrs. Sunita Sharma', 'Female', 'PGT Mathematics', 'Science & Math', 
    -- TODAY'S BIRTHDAY FOR TEACHER AUTOMATION!
    (CURRENT_DATE - INTERVAL '36 years')::date,
    '2015-07-10', 'M.Sc. Mathematics, B.Ed', '12 Years', 'Mathematics, Calculus', 'Class IX, Class X, Class XII', 
    '+919829134567', 'sunita.sharma@stjosephdholpur.com', 'Ondela Road, Dholpur', 'Dholpur, Rajasthan', '328001', 'A+', TRUE,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'May your day be filled with mathematics of joy and happiness!'
),
(
    'EMP-2026-103', 'Mr. Rajesh Verma', 'Male', 'TGT English Literature', 'Humanities', 
    '1992-08-25', '2018-06-15', 'M.A. English, B.Ed', '9 Years', 'English Language & Grammar', 'Class VI, Class VII, Class VIII', 
    '+919829145678', 'rajesh.verma@stjosephdholpur.com', 'Gulab Bagh, Dholpur', 'Dholpur, Rajasthan', '328001', 'B+', TRUE,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'Happy Birthday! Thank you for inspiring our students every day.'
),
(
    'EMP-2026-104', 'Dr. Anil Saxena', 'Male', 'PGT Chemistry', 'Science & Math', 
    '1984-03-22', '2014-08-01', 'Ph.D Organic Chemistry', '15 Years', 'Chemistry, Practical Chemistry', 'Class XI, Class XII', 
    '+919829156789', 'anil.saxena@stjosephdholpur.com', 'RAC Line Road, Dholpur', 'Dholpur, Rajasthan', '328001', 'O+', TRUE,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'Wishing Dr. Saxena a fantastic birthday filled with achievements!'
);

-- 5. INSERT MOCK TRANSFER CERTIFICATES (TCs)
INSERT INTO public.tc_records (
    roll_no, class, student_name, father_name, dob, tc_number, issue_date, file_url
) VALUES
('1001', 'Class X', 'Aarav Sharma', 'Rajendra Sharma', '2010-08-02', 'TC-2026-001', '2026-05-15', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('12004', 'Class XII', 'Priya Chhabra', 'Sunil Chhabra', '2008-03-12', 'TC-2026-002', '2026-05-18', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('8012', 'Class VIII', 'Hardik Meena', 'Mohan Meena', '2012-11-05', 'TC-2026-003', '2026-05-20', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('5009', 'Class V', 'Sneha Khandelwal', 'Rakesh Khandelwal', '2015-09-18', 'TC-2026-004', '2026-05-25', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

-- 6. INSERT MOCK BUS ROUTES (Uses double quotes for camelCase PostgreSQL column identifiers)
INSERT INTO public.transportation (
    area, "busNo", stops, "pickupTime", "dropTime", "driverName", "driverPhone", "monthlyFee", status
) VALUES
('Dholpur City & Railway Station Route', 'RJ-11-PA-101', 'Gulab Bagh, Ondela Road, Police Line, RAC Line, Railway Station', '07:00 AM', '02:15 PM', 'Mr. Ram Singh', '+91 98291-11223', '1,200', 'live'),
('Civil Lines & Circuit House Route', 'RJ-11-PA-102', 'Civil Lines, Circuit House, Collectorate, GT Road, Main Market', '07:15 AM', '02:25 PM', 'Mr. Brijesh Sharma', '+91 98292-22334', '1,300', 'live'),
('Ondela Road & RAC Line Route', 'RJ-11-PA-103', 'Ondela Chauraha, RAC Battalion Gate, Water Tank, City Hospital', '07:10 AM', '02:20 PM', 'Mr. Satish Kumar', '+91 98293-33445', '1,250', 'live'),
('Bari Road & Housing Board Route', 'RJ-11-PA-104', 'Bari Road, Housing Board Colony, Rajakhera Bypass, Sai Mandir', '07:20 AM', '02:30 PM', 'Mr. Jaswant Gurjar', '+91 98294-44556', '1,400', 'live');

-- 7. INSERT MOCK CLASSES MASTER
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT,
    stream TEXT DEFAULT 'General',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.classes (name, code, stream, display_order) VALUES
('Class PG', 'PG', 'General', 1),
('Class Nursery', 'NUR', 'General', 2),
('Class LKG', 'LKG', 'General', 3),
('Class UKG', 'UKG', 'General', 4),
('Class I', '1', 'General', 5),
('Class II', '2', 'General', 6),
('Class III', '3', 'General', 7),
('Class IV', '4', 'General', 8),
('Class V', '5', 'General', 9),
('Class VI', '6', 'General', 10),
('Class VII', '7', 'General', 11),
('Class VIII', '8', 'General', 12),
('Class IX', '9', 'General', 13),
('Class X', '10', 'General', 14),
('Class XI (Science)', '11-SCI', 'Science', 15),
('Class XI (Commerce)', '11-COM', 'Commerce', 16),
('Class XI (Arts)', '11-ART', 'Arts', 17),
('Class XII (Science)', '12-SCI', 'Science', 18),
('Class XII (Commerce)', '12-COM', 'Commerce', 19),
('Class XII (Arts)', '12-ART', 'Arts', 20)
ON CONFLICT (name) DO NOTHING;

-- 8. VERIFY ROW COUNTS IN ALL TABLES
SELECT 'students' AS table_name, COUNT(*) FROM public.students
UNION ALL
SELECT 'teachers' AS table_name, COUNT(*) FROM public.teachers
UNION ALL
SELECT 'tc_records' AS table_name, COUNT(*) FROM public.tc_records
UNION ALL
SELECT 'transportation' AS table_name, COUNT(*) FROM public.transportation
UNION ALL
SELECT 'classes' AS table_name, COUNT(*) FROM public.classes;
