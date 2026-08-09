-- ============================================================================
-- AUTOMATIC STUDENT BIRTHDAY WHATSAPP NOTIFICATION SYSTEM - SUPABASE MIGRATION
-- Production-Ready Schema & Initial Data (Fixed Column Alteration)
-- ============================================================================

-- 1. CREATE STUDENTS TABLE IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT,
  class TEXT NOT NULL DEFAULT 'I',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SAFELY ADD MISSING COLUMNS IF STUDENTS TABLE ALREADY EXISTED
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS form_no TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS session TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS admission_no TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'A';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS roll_no TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS age_march31 TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS nationality TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS religion TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS medical_condition TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS city_state TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS whatsapp_no TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_mobile TEXT;

-- Mother details
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mother_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mother_age TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mother_qualification TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mother_profession TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mother_city_state TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mother_whatsapp TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mother_email TEXT;

-- Father details
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS father_age TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS father_qualification TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS father_profession TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS father_city_state TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS father_whatsapp TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS father_email TEXT;

-- Previous School & Sibling details
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS previous_school_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS previous_class TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS previous_medium TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS previous_board TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS previous_school_address TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS previous_marks TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS has_sibling BOOLEAN DEFAULT false;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS sibling_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS sibling_admission_no TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS sibling_class TEXT;

-- Office Use & Fees details
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS admission_date DATE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS transport_required BOOLEAN DEFAULT true;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS total_fees NUMERIC;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS documents_submitted TEXT[];
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS councillor_sign TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS accountant_sign TEXT;

ALTER TABLE public.students ADD COLUMN IF NOT EXISTS active_status BOOLEAN DEFAULT true;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS wishes TEXT DEFAULT 'Happy Birthday!';

-- 3. BACKFILL STUDENT_NAME & ADMISSION_NO SAFELY
UPDATE public.students 
SET student_name = COALESCE(student_name, name, 'Student'),
    admission_no = COALESCE(admission_no, roll_no, CONCAT('SJ-', SUBSTRING(id::text FROM 1 FOR 6))),
    active_status = COALESCE(active_status, true);

-- 4. CREATE BIRTHDAY MESSAGE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.birthday_message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  parent_mobile TEXT NOT NULL,
  template_used TEXT,
  message TEXT NOT NULL,
  provider TEXT DEFAULT 'Meta',
  provider_message_id TEXT,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Sent', 'Failed', 'Retry'
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for duplicate prevention and fast daily log lookup
CREATE INDEX IF NOT EXISTS idx_bday_logs_student_date 
ON public.birthday_message_logs (student_id, created_at, status);

-- 5. CREATE NOTIFICATION TEMPLATES TABLE (Generic Reusable Engine Foundation)
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'birthday_student', -- 'birthday_student', 'birthday_teacher', 'fee_due', 'ptm', 'circular', etc.
  body TEXT NOT NULL,
  variables JSONB DEFAULT '["student_name", "parent_name", "class", "section", "school_name", "principal_name", "today", "academic_year"]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  provider TEXT DEFAULT 'Meta',
  meta_template_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CREATE NOTIFICATION SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auto_send_enabled BOOLEAN DEFAULT true,
  send_time TEXT DEFAULT '08:00',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  default_template_id UUID,
  provider TEXT DEFAULT 'Mock', -- 'Meta', 'Interakt', 'AiSensy', 'WATI', 'Twilio', 'Mock'
  max_retries INTEGER DEFAULT 3,
  max_rate_per_min INTEGER DEFAULT 60,
  school_name TEXT DEFAULT 'St. Joseph''s International School',
  principal_name TEXT DEFAULT 'Mr. Praveen Tyagi',
  footer_text TEXT DEFAULT 'St. Joseph''s International School, Dholpur (CBSE Affiliated)',
  api_credentials JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. CREATE TEACHERS TABLE IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.teachers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT DEFAULT 'General',
  dob TEXT,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  wishes TEXT DEFAULT 'Happy Birthday!',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. ENABLE ROW LEVEL SECURITY (RLS) & POLICIES FOR ALL TABLES
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access on students" ON public.students;
CREATE POLICY "Public access on students" ON public.students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on teachers" ON public.teachers;
CREATE POLICY "Public access on teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on bday_logs" ON public.birthday_message_logs;
CREATE POLICY "Public access on bday_logs" ON public.birthday_message_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on templates" ON public.notification_templates;
CREATE POLICY "Public access on templates" ON public.notification_templates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on settings" ON public.notification_settings;
CREATE POLICY "Public access on settings" ON public.notification_settings FOR ALL USING (true) WITH CHECK (true);

-- 8. SEED DEFAULT TEMPLATES AND SYSTEM SETTINGS
INSERT INTO public.notification_templates (id, name, type, body, is_active, provider, meta_template_name)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Official School Birthday Wish (Default)',
    'birthday_student',
    '🎉 Dear {{parent_name}},

Warm birthday wishes to our dear student *{{student_name}}* (Class {{class}}-{{section}}).

May this special day bring happiness, good health, wisdom, and success.
May your child continue to shine and achieve great milestones.

Happy Birthday! 🎂✨

Regards,
*{{principal_name}}*
*{{school_name}}*',
    true,
    'Meta',
    'student_birthday_wish'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Short & Warm Birthday Greetings',
    'birthday_student',
    '🌟 Happy Birthday to *{{student_name}}*! 

Dear {{parent_name}}, the management and faculty of {{school_name}} wish {{student_name}} a fantastic birthday filled with joy and academic success!

Warm Regards,
{{school_name}} Management',
    true,
    'Meta',
    'birthday_short_wish'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.notification_settings (
  id,
  auto_send_enabled,
  send_time,
  timezone,
  default_template_id,
  provider,
  max_retries,
  max_rate_per_min,
  school_name,
  principal_name,
  footer_text,
  api_credentials
)
VALUES (
  '99999999-9999-9999-9999-999999999999',
  true,
  '08:00',
  'Asia/Kolkata',
  '11111111-1111-1111-1111-111111111111',
  'Mock',
  3,
  60,
  'St. Joseph''s International School',
  'Mr. Praveen Tyagi',
  'St. Joseph''s International School, Dholpur (CBSE Affiliated)',
  '{
    "meta_phone_number_id": "100982391298",
    "meta_access_token": "EAAG...",
    "wati_api_endpoint": "https://live-server.wati.io",
    "wati_access_token": "",
    "interakt_api_key": "",
    "aisensy_api_key": "",
    "twilio_account_sid": "",
    "twilio_auth_token": "",
    "twilio_from_number": "whatsapp:+14155238886"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
