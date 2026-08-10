import { supabase, SUPABASE_ANON_KEY } from "../db";
import {
  StudentRecord,
  BirthdayMessageLog,
  NotificationTemplate,
  NotificationSettings,
  WhatsAppProviderType
} from "./types";
import { renderWhatsAppTemplate, formatPhoneNumber } from "./templateEngine";
import { getWhatsAppProvider } from "./providerFactory";

const LOCAL_LOGS_KEY = "stj_bday_logs";
const LOCAL_TEMPLATES_KEY = "stj_bday_templates";
const LOCAL_SETTINGS_KEY = "stj_bday_settings";

const defaultSettings: NotificationSettings = {
  id: "99999999-9999-9999-9999-999999999999",
  auto_send_enabled: true,
  send_time: "08:00",
  timezone: "Asia/Kolkata",
  provider: "Mock",
  max_retries: 3,
  max_rate_per_min: 60,
  school_name: "St. Joseph's International School",
  footer_text: "St. Joseph's International School, Dholpur (CBSE Affiliated)",
  api_credentials: {}
};

// 8 Innovative Student Templates + 8 Professional Teacher Templates
const defaultTemplates: NotificationTemplate[] = [
  // 🎓 STUDENT TEMPLATES (8 Variations)
  {
    id: "std_tpl_1",
    name: "Student Wish 1: Official Milestone Wish",
    type: "birthday_student",
    body: `🎉 Dear {{parent_name}},

Warm birthday wishes to our dear student *{{student_name}}* (Class {{class}}-{{section}}).

May this special day bring happiness, good health, wisdom, and success. May your child continue to shine bright and achieve great milestones! 🎂✨

Best Regards,
*{{school_name}}*`,
    variables: ["student_name", "parent_name", "class", "section", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "student_bday_1"
  },
  {
    id: "std_tpl_2",
    name: "Student Wish 2: Bright Future & Excellence",
    type: "birthday_student",
    body: `🌟 Happy Birthday *{{student_name}}*! 🎓

Dear {{parent_name}}, on this special day, the management & faculty of {{school_name}} wish {{student_name}} good health, laughter, and high academic achievements.

Keep shining bright! 🎈

Best Regards,
*{{school_name}}*`,
    variables: ["student_name", "parent_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "student_bday_2"
  },
  {
    id: "std_tpl_3",
    name: "Student Wish 3: Dream Big & Succeed",
    type: "birthday_student",
    body: `🎂 Special Birthday Greetings to *{{student_name}}* (Class {{class}})! ✨

Dear {{parent_name}}, may your child's birthday be filled with sweet moments and big dreams. May {{student_name}} reach new heights in learning and character!

Best Regards,
*{{school_name}}*`,
    variables: ["student_name", "parent_name", "class", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "student_bday_3"
  },
  {
    id: "std_tpl_4",
    name: "Student Wish 4: Leader of Tomorrow",
    type: "birthday_student",
    body: `🚀 Happy Birthday *{{student_name}}*!

Dear {{parent_name}}, we are proud to have {{student_name}} as part of our {{school_name}} family. Wishing them a fantastic year of growth, joy, and success! 🏆

Warm Regards,
*{{school_name}} Management*`,
    variables: ["student_name", "parent_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "student_bday_4"
  },
  {
    id: "std_tpl_5",
    name: "Student Wish 5: Creative & Joyful Blessings",
    type: "birthday_student",
    body: `🎈 Happy Birthday Dear *{{student_name}}*!

Dear {{parent_name}}, wishing your child a day as special and wonderful as they are. May God bless {{student_name}} with bright knowledge, curiosity, and happiness!

With Love & Best Regards,
*{{school_name}}*`,
    variables: ["student_name", "parent_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "student_bday_5"
  },
  {
    id: "std_tpl_6",
    name: "Student Wish 6: Courage & Curiosity",
    type: "birthday_student",
    body: `✨ Dear {{parent_name}},

Happy Birthday to *{{student_name}}* (Class {{class}}-{{section}})! May courage, curiosity, and kindness guide your child to great success in the academic year ahead. 📚🎉

Warm Regards,
*{{school_name}}*`,
    variables: ["student_name", "parent_name", "class", "section", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "student_bday_6"
  },
  {
    id: "std_tpl_7",
    name: "Student Wish 7: Star Student Celebration",
    type: "birthday_student",
    body: `⭐ Shining Birthday Wishes to *{{student_name}}*!

Dear {{parent_name}}, today we celebrate {{student_name}}'s special day! Wishing them endless smiles, fun memories, and outstanding learning.

Best Regards,
*{{school_name}}*`,
    variables: ["student_name", "parent_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "student_bday_7"
  },
  {
    id: "std_tpl_8",
    name: "Student Wish 8: Joyful Milestone",
    type: "birthday_student",
    body: `🎁 Happy Birthday *{{student_name}}*!

Dear {{parent_name}}, another wonderful year of learning and growing! We wish {{student_name}} a joyful birthday celebration and a bright future.

Best Regards,
*{{school_name}}*`,
    variables: ["student_name", "parent_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "student_bday_8"
  },

  // 👨‍🏫 TEACHER TEMPLATES (8 Variations)
  {
    id: "tch_tpl_1",
    name: "Teacher Wish 1: Inspiring Mentor Wish",
    type: "birthday_teacher",
    body: `🌸 Dear *{{teacher_name}}*,

Warmest birthday wishes to our esteemed faculty member! 🎂

Thank you for your dedication, wisdom, and guiding our students towards excellence. May your year be filled with happiness, good health, and success. ✨

Best Regards,
*{{school_name}}*`,
    variables: ["teacher_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "teacher_bday_1"
  },
  {
    id: "tch_tpl_2",
    name: "Teacher Wish 2: Dedicated Educator",
    type: "birthday_teacher",
    body: `🎓 Happy Birthday to an exceptional educator, *{{teacher_name}}*!

Your passion for teaching inspires everyone at {{school_name}}. May your special day bring you immense joy and fulfillment!

Warm Regards,
*{{school_name}} Management*`,
    variables: ["teacher_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "teacher_bday_2"
  },
  {
    id: "tch_tpl_3",
    name: "Teacher Wish 3: Pillar of Knowledge",
    type: "birthday_teacher",
    body: `💐 Respected *{{teacher_name}}*,

Wishing you a very Happy Birthday! 🎈 Thank you for being a beacon of knowledge and character for our school community.

May God bless you with prosperity and health.

Best Regards,
*{{school_name}}*`,
    variables: ["teacher_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "teacher_bday_3"
  },
  {
    id: "tch_tpl_4",
    name: "Teacher Wish 4: Wisdom & Leadership",
    type: "birthday_teacher",
    body: `🌟 Happy Birthday *{{teacher_name}}*!

On your special day, {{school_name}} family extends heartfelt wishes for health, success, and continued joy in shaping future leaders.

Warm Regards,
*{{school_name}}*`,
    variables: ["teacher_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "teacher_bday_4"
  },
  {
    id: "tch_tpl_5",
    name: "Teacher Wish 5: Valued Contributions",
    type: "birthday_teacher",
    body: `🎂 Dear *{{teacher_name}}*,

Wishing you a joyful birthday filled with happy moments! We deeply appreciate your valuable contributions to our school's growth.

Best Regards,
*{{school_name}}*`,
    variables: ["teacher_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "teacher_bday_5"
  },
  {
    id: "tch_tpl_6",
    name: "Teacher Wish 6: Excellence in Teaching",
    type: "birthday_teacher",
    body: `✨ Happy Birthday Respected *{{teacher_name}}*!

May your year ahead be as rewarding and inspiring as the wisdom you impart to our students daily.

Warm Regards,
*{{school_name}}*`,
    variables: ["teacher_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "teacher_bday_6"
  },
  {
    id: "tch_tpl_7",
    name: "Teacher Wish 7: Educational Champion",
    type: "birthday_teacher",
    body: `🎉 Warm Birthday Greetings to *{{teacher_name}}*!

Thank you for your unwavering commitment to educational excellence at {{school_name}}. Wishing you a fantastic year ahead!

Best Regards,
*{{school_name}} Management*`,
    variables: ["teacher_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "teacher_bday_7"
  },
  {
    id: "tch_tpl_8",
    name: "Teacher Wish 8: Health & Peace Blessings",
    type: "birthday_teacher",
    body: `🎈 Happy Birthday *{{teacher_name}}*!

Wishing you good health, peace, and prosperity on your birthday. Thank you for making a difference every single day!

Best Regards,
*{{school_name}}*`,
    variables: ["teacher_name", "school_name"],
    is_active: true,
    provider: "Meta",
    meta_template_name: "teacher_bday_8"
  }
];

// Helper to get/set localStorage safely
function getStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

/**
 * Checks if a date matches today's month & day
 */
export function isBirthdayToday(dateString?: string): boolean {
  if (!dateString) return false;
  const today = new Date();
  const d = new Date(dateString);

  if (!isNaN(d.getTime())) {
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  }

  // Handle DD/MM/YYYY or YYYY-MM-DD string formats
  const parts = dateString.split(/[-/]/);
  if (parts.length === 3) {
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1;

    // If YYYY-MM-DD
    if (parts[0].length === 4) {
      day = parseInt(parts[2], 10);
      month = parseInt(parts[1], 10) - 1;
    }

    return day === today.getDate() && month === today.getMonth();
  }

  return false;
}

/**
 * Calculates days remaining until next birthday
 */
export function daysUntilBirthday(dateString?: string): number {
  if (!dateString) return 999;
  const today = new Date();
  const d = new Date(dateString);
  let bdayMonth = d.getMonth();
  let bdayDay = d.getDate();

  if (isNaN(d.getTime())) {
    const parts = dateString.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        bdayMonth = parseInt(parts[1], 10) - 1;
        bdayDay = parseInt(parts[2], 10);
      } else {
        bdayDay = parseInt(parts[0], 10);
        bdayMonth = parseInt(parts[1], 10) - 1;
      }
    }
  }

  const currentYear = today.getFullYear();
  let nextBday = new Date(currentYear, bdayMonth, bdayDay);

  // If already passed this year, check next year
  if (nextBday.getTime() < today.getTime()) {
    nextBday = new Date(currentYear + 1, bdayMonth, bdayDay);
  }

  const diffTime = nextBday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Filters list of students/teachers to find those with birthdays today
 */
export function getTodayBirthdays(students: StudentRecord[]): StudentRecord[] {
  return students.filter((s) => isBirthdayToday(s.dob || s.date_of_birth));
}

/**
 * Gets upcoming birthdays within next N days (default 7 days)
 */
export function getUpcomingBirthdays(students: StudentRecord[], daysAhead = 7): StudentRecord[] {
  return students
    .filter((s) => {
      const days = daysUntilBirthday(s.dob || s.date_of_birth);
      return days > 0 && days <= daysAhead;
    })
    .sort((a, b) => daysUntilBirthday(a.dob || a.date_of_birth) - daysUntilBirthday(b.dob || b.date_of_birth));
}

/**
 * Fetch Settings
 */
export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("notification_settings").select("*").single();
      if (!error && data) return data;
    } catch {}
  }
  return getStorage(LOCAL_SETTINGS_KEY, defaultSettings);
}

/**
 * Save Settings
 */
export async function saveNotificationSettings(st: NotificationSettings): Promise<NotificationSettings> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("notification_settings").upsert([st]);
    } catch {}
  }
  setStorage(LOCAL_SETTINGS_KEY, st);
  return st;
}

/**
 * Fetch Templates: Automatically merges missing default templates into stored list
 */
export async function fetchNotificationTemplates(): Promise<NotificationTemplate[]> {
  let list: NotificationTemplate[] = [];

  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("notification_templates").select("*").order("created_at");
      if (!error && data && data.length > 0) list = data;
    } catch {}
  }

  // Ensure all 16 default templates exist in the list
  const existingIds = new Set(list.map((t) => t.id));
  for (const defTpl of defaultTemplates) {
    if (!existingIds.has(defTpl.id)) {
      list.push(defTpl);
    }
  }

  return list;
}

/**
 * Resets templates back to all 16 default templates (8 Student + 8 Teacher)
 */
export async function resetDefaultTemplates(): Promise<NotificationTemplate[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("notification_templates").upsert(defaultTemplates);
    } catch {}
  }
  return defaultTemplates;
}

/**
 * Save Template
 */
export async function saveNotificationTemplate(tpl: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
  const newTpl: NotificationTemplate = {
    id: tpl.id || `tpl_${Date.now()}`,
    name: tpl.name || "Untitled Template",
    type: tpl.type || "birthday_student",
    body: tpl.body || "",
    variables: tpl.variables || ["student_name", "parent_name", "class", "section", "school_name"],
    is_active: tpl.is_active ?? true,
    provider: tpl.provider || "Meta",
    meta_template_name: tpl.meta_template_name || "student_birthday_wish",
    updated_at: new Date().toISOString()
  };

  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("notification_templates").upsert([newTpl]);
    } catch {}
  }

  return newTpl;
}

/**
 * Delete Template
 */
export async function deleteNotificationTemplate(id: string): Promise<void> {
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("notification_templates").delete().eq("id", id);
    } catch {}
  }
}

/**
 * Fetch Delivery Logs
 */
export async function fetchBirthdayLogs(): Promise<BirthdayMessageLog[]> {
  if (SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase.from("birthday_message_logs").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch {}
  }
  return [];
}

/**
 * Duplicate Prevention Check:
 * Checks if a successful message was already sent to this student today.
 */
export async function hasMessageBeenSentToday(studentId: string): Promise<boolean> {
  const logs = await fetchBirthdayLogs();
  const todayStr = new Date().toISOString().split("T")[0];

  return logs.some((l) => {
    if (l.student_id !== studentId) return false;
    if (l.status !== "Sent") return false;
    const logDateStr = new Date(l.created_at).toISOString().split("T")[0];
    return logDateStr === todayStr;
  });
}

/**
 * Core Send Function: Randomly picks an active template matching student or teacher type!
 */
export async function sendBirthdayWishToStudent(
  student: StudentRecord,
  templateId?: string,
  overrideProvider?: WhatsAppProviderType
): Promise<{ success: boolean; log: BirthdayMessageLog }> {
  const settings = await fetchNotificationSettings();
  const templates = await fetchNotificationTemplates();

  const isTeacher = (student as any).designation || (student as any).role === "teacher" || (student as any).department;
  const targetType = isTeacher ? "birthday_teacher" : "birthday_student";

  let selectedTemplate: NotificationTemplate;
  if (templateId) {
    selectedTemplate = templates.find((t) => t.id === templateId) || defaultTemplates[0];
  } else {
    // Filter active templates by type (student vs teacher)
    const matchingTemplates = templates.filter(
      (t) => t.is_active && (t.type === targetType || (!t.type && targetType === "birthday_student"))
    );

    if (matchingTemplates.length > 0) {
      // Pick random active template!
      const randomIndex = Math.floor(Math.random() * matchingTemplates.length);
      selectedTemplate = matchingTemplates[randomIndex];
    } else {
      const fallbackMatching = defaultTemplates.filter((t) => t.type === targetType);
      selectedTemplate = fallbackMatching[Math.floor(Math.random() * fallbackMatching.length)] || defaultTemplates[0];
    }
  }

  const activeProviderType = overrideProvider || settings.provider || "Mock";

  const studentName = student.student_name || student.name || "Student";
  const rawMobile = student.parent_mobile || "9928623387";
  const mobileFormatted = formatPhoneNumber(rawMobile);

  // Duplicate Check
  const alreadySent = await hasMessageBeenSentToday(student.id);
  if (alreadySent) {
    const existingLog: BirthdayMessageLog = {
      id: `dup_${Date.now()}`,
      student_id: student.id,
      student_name: studentName,
      class: student.class,
      section: student.section,
      parent_mobile: mobileFormatted,
      template_used: selectedTemplate.name,
      message: "Skipped: Birthday wish already delivered today.",
      provider: activeProviderType,
      status: "Sent",
      error_message: "Duplicate prevented. Wish sent earlier today.",
      created_at: new Date().toISOString()
    };
    return { success: true, log: existingLog };
  }

  // Render Template
  const messageText = renderWhatsAppTemplate(selectedTemplate.body, { student, settings });

  // Resolve Provider & Execute Payload
  const provider = getWhatsAppProvider(activeProviderType);
  const response = await provider.sendMessage(
    {
      to: mobileFormatted,
      message: messageText,
      templateName: selectedTemplate.meta_template_name,
      recipientName: student.father_name || student.mother_name || studentName
    },
    settings
  );

  const logEntry: BirthdayMessageLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    student_id: student.id,
    student_name: studentName,
    class: student.class,
    section: student.section,
    parent_mobile: mobileFormatted,
    template_used: selectedTemplate.name,
    message: messageText,
    provider: activeProviderType,
    provider_message_id: response.providerMessageId,
    status: response.success ? "Sent" : "Failed",
    error_message: response.errorMessage,
    sent_at: response.success ? new Date().toISOString() : undefined,
    created_at: new Date().toISOString()
  };

  // Persist Log Entry
  if (SUPABASE_ANON_KEY) {
    try {
      await supabase.from("birthday_message_logs").insert([logEntry]);
    } catch {}
  }

  const logs = getStorage<BirthdayMessageLog[]>(LOCAL_LOGS_KEY, []);
  logs.unshift(logEntry);
  setStorage(LOCAL_LOGS_KEY, logs);

  return { success: response.success, log: logEntry };
}

/**
 * Retry Failed Log
 */
export async function retryFailedBirthdayLog(logId: string): Promise<{ success: boolean; log?: BirthdayMessageLog }> {
  const logs = await fetchBirthdayLogs();
  const targetLog = logs.find((l) => l.id === logId);
  if (!targetLog) return { success: false };

  const mockStudent: StudentRecord = {
    id: targetLog.student_id,
    student_name: targetLog.student_name,
    class: targetLog.class || "I",
    section: targetLog.section || "A",
    parent_mobile: targetLog.parent_mobile
  };

  return sendBirthdayWishToStudent(mockStudent, undefined, targetLog.provider as WhatsAppProviderType);
}

/**
 * Automated 8:00 AM Daily Scheduler Runner
 */
export async function runDailyBirthdayScheduler(
  students: StudentRecord[]
): Promise<{ processed: number; sentCount: number; failedCount: number; logs: BirthdayMessageLog[] }> {
  const settings = await fetchNotificationSettings();
  if (!settings.auto_send_enabled) {
    return { processed: 0, sentCount: 0, failedCount: 0, logs: [] };
  }

  const todayBirthdays = getTodayBirthdays(students);
  let sentCount = 0;
  let failedCount = 0;
  const newLogs: BirthdayMessageLog[] = [];

  for (const student of todayBirthdays) {
    const isAlreadySent = await hasMessageBeenSentToday(student.id);
    if (!isAlreadySent) {
      const res = await sendBirthdayWishToStudent(student);
      if (res.success) sentCount++;
      else failedCount++;
      newLogs.push(res.log);
    }
  }

  return {
    processed: todayBirthdays.length,
    sentCount,
    failedCount,
    logs: newLogs
  };
}
