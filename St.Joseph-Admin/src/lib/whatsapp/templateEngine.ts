import { StudentRecord, NotificationSettings } from "./types";

export interface TemplateContext {
  student: StudentRecord;
  settings: NotificationSettings;
  todayDate?: string;
  academicYear?: string;
}

/**
 * Interpolates placeholders like {{student_name}}, {{parent_name}}, {{class}}, etc.
 */
export function renderWhatsAppTemplate(templateBody: string, context: TemplateContext): string {
  const { student, settings } = context;

  const todayStr = context.todayDate || new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const yearNum = new Date().getFullYear();
  const academicYearStr = context.academicYear || `${yearNum}-${yearNum + 1}`;

  const parentName = student.father_name || student.mother_name || "Parent";
  const studentName = student.student_name || student.name || "Student";
  const className = student.class || "N/A";
  const sectionName = student.section || "A";
  const schoolName = settings.school_name || "St. Joseph's International School";
  const principalName = settings.principal_name || "Mr. Praveen Tyagi";

  const replacements: Record<string, string> = {
    "{{student_name}}": studentName,
    "{{parent_name}}": parentName,
    "{{class}}": className,
    "{{section}}": sectionName,
    "{{school_name}}": schoolName,
    "{{principal_name}}": principalName,
    "{{today}}": todayStr,
    "{{academic_year}}": academicYearStr,
  };

  let rendered = templateBody;
  Object.entries(replacements).forEach(([key, val]) => {
    // Replace all occurrences case-insensitively
    const regex = new RegExp(key.replace(/[{}]/g, "\\$&"), "gi");
    rendered = rendered.replace(regex, val);
  });

  return rendered;
}

/**
 * Sanitizes phone numbers into E.164 format (+919928623387)
 */
export function formatPhoneNumber(phone?: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.length === 10) {
      cleaned = `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
      cleaned = `+${cleaned}`;
    }
  }
  return cleaned;
}
