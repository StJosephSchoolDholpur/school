-- =============================================================================
-- ST. JOSEPH'S INTERNATIONAL SCHOOL - SUPABASE DATABASE SCHEMA SETUP
-- Run this script in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard)
-- =============================================================================

-- 1. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT DEFAULT 'General',
    dob DATE NOT NULL,
    photo_url TEXT,
    email TEXT,
    phone TEXT,
    wishes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    section TEXT DEFAULT 'A',
    roll_no TEXT,
    dob DATE NOT NULL,
    photo_url TEXT,
    wishes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TC RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.tc_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roll_no TEXT NOT NULL,
    class TEXT NOT NULL,
    student_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    tc_number TEXT UNIQUE NOT NULL,
    issue_date TEXT NOT NULL,
    file_path TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FEE STRUCTURE TABLE
CREATE TABLE IF NOT EXISTS public.fee_structure (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    total TEXT NOT NULL,
    "admissionPay" TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TRANSPORTATION TABLE
CREATE TABLE IF NOT EXISTS public.transportation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    area TEXT NOT NULL,
    "busNo" TEXT NOT NULL,
    stops TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "dropTime" TEXT DEFAULT '02:30 PM',
    "driverName" TEXT,
    "driverPhone" TEXT,
    "monthlyFee" TEXT DEFAULT '1,200',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. MANDATORY DISCLOSURES TABLE
CREATE TABLE IF NOT EXISTS public.mandatory_disclosures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    is_official_5 BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. FEE COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.fee_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    receipt_no TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    class TEXT NOT NULL,
    amount_paid NUMERIC NOT NULL,
    payment_mode TEXT DEFAULT 'Cash',
    transaction_id TEXT,
    payment_date DATE DEFAULT CURRENT_DATE,
    collected_by TEXT DEFAULT 'Admin',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & Grant Public Read Access for website
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandatory_disclosures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access Teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Public Read Access Students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public Read Access TC" ON public.tc_records FOR SELECT USING (true);
CREATE POLICY "Public Read Access Fees" ON public.fee_structure FOR SELECT USING (true);
CREATE POLICY "Public Read Access Transport" ON public.transportation FOR SELECT USING (true);
CREATE POLICY "Public Read Access Mandatory" ON public.mandatory_disclosures FOR SELECT USING (true);
CREATE POLICY "Public Read Access Fee Collections" ON public.fee_collections FOR SELECT USING (true);

-- Grant All Access Policies for Admin Operations
CREATE POLICY "Full Access Teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access TC" ON public.tc_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Fees" ON public.fee_structure FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Transport" ON public.transportation FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Mandatory" ON public.mandatory_disclosures FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Fee Collections" ON public.fee_collections FOR ALL USING (true) WITH CHECK (true);

-- 7. INITIAL SAMPLE DATA SEEDING
INSERT INTO public.teachers (name, designation, department, dob, wishes) VALUES
('Mr. Praveen Tyagi', 'Principal', 'Administration', '1980-08-15', 'Wishing our beloved Principal a joyful birthday!'),
('Mrs. Sunita Sharma', 'PGT Mathematics', 'Science & Math', '1988-08-02', 'May your day be filled with mathematics of joy and happiness!'),
('Mr. Rajesh Verma', 'TGT English Literature', 'Humanities', '1992-08-05', 'Happy Birthday! Thank you for inspiring our students every day.')
ON CONFLICT DO NOTHING;

INSERT INTO public.students (name, class, roll_no, dob, wishes) VALUES
('Aarav Sharma', 'Class X-A', '1001', '2010-08-02', 'Happy Birthday Aarav! Wishing you brilliant success in Class 10!'),
('Ananya Gupta', 'Class VIII-B', '8042', '2012-08-03', 'Happy Birthday Ananya! Keep shining bright!'),
('Rohan Singh', 'Class XII Science', '12015', '2008-08-06', 'Happy Birthday Rohan! Best wishes for your board year!')
ON CONFLICT DO NOTHING;

INSERT INTO public.transportation (area, "busNo", stops, "pickupTime", "driverName", "driverPhone") VALUES
('Dholpur City & Railway Station', 'RJ-11-PA-101', 'Gulab Bagh, Ondela Road, Police Line, RAC Line, Railway Station', '07:00 AM', 'Mr. Ram Singh', '+91 98291-11223'),
('Bari Highway Route', 'RJ-11-PA-102', 'Bari Town Center, Toll Plaza, Highway Junction', '06:45 AM', 'Mr. Mukesh Kumar', '+91 94142-33445')
ON CONFLICT DO NOTHING;
