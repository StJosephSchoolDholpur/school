// Types for Automatic WhatsApp Birthday & Generic Notification Engine

export type WhatsAppProviderType = "Meta" | "OpenWA" | "Interakt" | "AiSensy" | "WATI" | "Twilio" | "Mock";

export type MessageLogStatus = "Pending" | "Sent" | "Failed" | "Retry";

export interface StudentRecord {
  id: string;
  admission_no?: string;
  student_name?: string;
  name?: string; // legacy fallback
  class: string;
  section?: string;
  roll_no?: string;
  dob?: string; // string representation
  date_of_birth?: string; // ISO / YYYY-MM-DD
  father_name?: string;
  mother_name?: string;
  parent_mobile?: string;
  active_status?: boolean;
  photo_url?: string;
  wishes?: string;
}

export interface BirthdayMessageLog {
  id: string;
  student_id: string;
  parent_mobile: string;
  template_used: string;
  message: string;
  provider: WhatsAppProviderType;
  provider_message_id?: string;
  status: MessageLogStatus;
  error_message?: string;
  sent_at?: string;
  created_at: string;
  student_name?: string;
  class?: string;
  section?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string; // "birthday_student", "birthday_teacher", "fee_due", "ptm", "circular", etc.
  body: string;
  variables: string[];
  is_active: boolean;
  provider: WhatsAppProviderType;
  meta_template_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationSettings {
  id: string;
  auto_send_enabled: boolean;
  send_time: string; // e.g. "08:00"
  timezone: string; // e.g. "Asia/Kolkata"
  default_template_id?: string;
  provider: WhatsAppProviderType;
  max_retries: number;
  max_rate_per_min: number;
  school_name: string;
  principal_name: string;
  footer_text: string;
  api_credentials: {
    openwa_api_url?: string;
    openwa_api_key?: string;
    openwa_session_id?: string;
    meta_phone_number_id?: string;
    meta_access_token?: string;
    wati_api_endpoint?: string;
    wati_access_token?: string;
    interakt_api_key?: string;
    aisensy_api_key?: string;
    twilio_account_sid?: string;
    twilio_auth_token?: string;
    twilio_from_number?: string;
  };
  updated_at?: string;
}

export interface SendWhatsAppPayload {
  to: string; // phone number e.g. "+919876543210" or "9876543210"
  message: string;
  templateName?: string;
  variables?: Record<string, string>;
  recipientName?: string;
}

export interface WhatsAppProviderResponse {
  success: boolean;
  providerMessageId?: string;
  errorMessage?: string;
  rawResponse?: any;
}
