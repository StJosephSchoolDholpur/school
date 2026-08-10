import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Gift,
  Calendar,
  Settings as SettingsIcon,
  FileText,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Sliders,
  ShieldAlert,
  Sparkles,
  Zap,
  Phone,
  Check,
  X,
  Play,
  RotateCcw
} from "lucide-react";
import {
  StudentRecord,
  BirthdayMessageLog,
  NotificationTemplate,
  NotificationSettings,
  WhatsAppProviderType
} from "../lib/whatsapp/types";
import {
  getTodayBirthdays,
  getUpcomingBirthdays,
  daysUntilBirthday,
  fetchBirthdayLogs,
  fetchNotificationTemplates,
  fetchNotificationSettings,
  saveNotificationTemplate,
  deleteNotificationTemplate,
  resetDefaultTemplates,
  saveNotificationSettings,
  sendBirthdayWishToStudent,
  retryFailedBirthdayLog,
  runDailyBirthdayScheduler
} from "../lib/whatsapp/birthdayEngineService";
import { renderWhatsAppTemplate, formatPhoneNumber } from "../lib/whatsapp/templateEngine";

interface WhatsAppBirthdayManagerProps {
  students: StudentRecord[];
  onRefreshData?: () => void;
}

export const WhatsAppBirthdayManager: React.FC<WhatsAppBirthdayManagerProps> = ({ students, onRefreshData }) => {
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "upcoming" | "templates" | "logs" | "settings">("dashboard");

  // State Data
  const [logs, setLogs] = useState<BirthdayMessageLog[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingStudentId, setSendingStudentId] = useState<string | null>(null);
  const [locallySentIds, setLocallySentIds] = useState<Set<string>>(new Set());
  const [isSchedulerRunning, setIsSchedulerRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState<string>("All");
  const [upcomingDaysFilter, setUpcomingDaysFilter] = useState<number>(7);
  const [templateTypeFilter, setTemplateTypeFilter] = useState<"all" | "birthday_student" | "birthday_teacher">("all");

  // Modal States
  const [editingTemplate, setEditingTemplate] = useState<Partial<NotificationTemplate> | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);
  const [testMobile, setTestMobile] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Load All WhatsApp Engine Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedLogs, fetchedTemplates, fetchedSettings] = await Promise.all([
        fetchBirthdayLogs(),
        fetchNotificationTemplates(),
        fetchNotificationSettings()
      ]);
      setLogs(fetchedLogs);
      setTemplates(fetchedTemplates);
      setSettings(fetchedSettings);
    } catch (err) {
      console.error("Error loading WhatsApp manager data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute Today's Birthdays & Forecast
  const todayBirthdays = useMemo(() => getTodayBirthdays(students), [students]);
  const upcomingBirthdays = useMemo(() => getUpcomingBirthdays(students, upcomingDaysFilter), [students, upcomingDaysFilter]);

  const sentTodayCount = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return logs.filter((l) => l.status === "Sent" && l.created_at.startsWith(todayStr)).length;
  }, [logs]);

  const failedCount = useMemo(() => logs.filter((l) => l.status === "Failed").length, [logs]);

  // Handle Send Single Birthday Wish
  const handleSendWishNow = async (student: StudentRecord, templateId?: string) => {
    setSendingStudentId(student.id);
    try {
      const result = await sendBirthdayWishToStudent(student, templateId);
      if (result.success) {
        setLocallySentIds((prev) => new Set(prev).add(student.id));
        showToast(`🎉 Birthday wish sent to ${student.student_name || student.name || "Student"}!`);
      } else {
        showToast(`❌ Failed to send wish: ${result.log.error_message || "Unknown error"}`, "error");
      }
      await loadData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`, "error");
    } finally {
      setSendingStudentId(null);
    }
  };

  // Run Manual Scheduler Batch
  const handleRunScheduler = async () => {
    setIsSchedulerRunning(true);
    try {
      const result = await runDailyBirthdayScheduler(students);
      showToast(`🚀 Scheduler executed! ${result.sentCount} sent, ${result.failedCount} failed for ${result.processed} birthday students today.`);
      await loadData();
    } catch (err: any) {
      showToast(`❌ Scheduler error: ${err.message}`, "error");
    } finally {
      setIsSchedulerRunning(false);
    }
  };

  // Retry Log
  const handleRetryLog = async (logId: string) => {
    try {
      const res = await retryFailedBirthdayLog(logId);
      if (res.success) {
        showToast("✅ Retry attempt succeeded and delivered!");
      } else {
        showToast("❌ Retry attempt failed.", "error");
      }
      await loadData();
    } catch (err: any) {
      showToast(`❌ Retry error: ${err.message}`, "error");
    }
  };

  // Export CSV Logs
  const handleExportCSV = () => {
    if (logs.length === 0) {
      showToast("No logs available to export.", "error");
      return;
    }
    const headers = ["ID", "Student ID", "Student Name", "Class", "Section", "Parent Mobile", "Template", "Provider", "Status", "Error Message", "Created At"];
    const rows = logs.map((l) => [
      l.id,
      l.student_id,
      `"${l.student_name || "N/A"}"`,
      `"${l.class || "N/A"}"`,
      `"${l.section || "N/A"}"`,
      `"${l.parent_mobile || "N/A"}"`,
      `"${l.template_used || "N/A"}"`,
      l.provider,
      l.status,
      `"${l.error_message || ""}"`,
      l.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `whatsapp_birthday_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📊 Delivery report CSV downloaded!");
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (logStatusFilter !== "All" && l.status !== logStatusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const sName = (l.student_name || "").toLowerCase();
        const mob = (l.parent_mobile || "").toLowerCase();
        return sName.includes(q) || mob.includes(q) || l.student_id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [logs, logStatusFilter, searchQuery]);

  // Handle Save Settings
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await saveNotificationSettings(settings);
      showToast("⚙️ WhatsApp Notification Settings updated successfully!");
    } catch (err: any) {
      showToast(`Error saving settings: ${err.message}`, "error");
    }
  };

  // Handle Send Test Message
  const handleSendTestMessage = async () => {
    if (!testMobile || !settings) {
      showToast("Please enter a valid mobile number for testing.", "error");
      return;
    }
    setIsSendingTest(true);
    try {
      const mockStudent: StudentRecord = {
        id: "test_std_001",
        student_name: "Aarav Sharma",
        class: "X",
        section: "A",
        father_name: "Mr. Rajesh Sharma",
        parent_mobile: testMobile
      };
      const res = await sendBirthdayWishToStudent(mockStudent, undefined, settings.provider);
      if (res.success) {
        showToast(`✅ Test message sent to ${testMobile} via ${settings.provider} Provider!`);
      } else {
        showToast(`❌ Test failed: ${res.log.error_message}`, "error");
      }
      await loadData();
    } catch (err: any) {
      showToast(`❌ Test error: ${err.message}`, "error");
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border transition-all ${
            toastMessage.type === "success"
              ? "bg-slate-900 text-emerald-400 border-emerald-500/40 ring-4 ring-emerald-500/20"
              : "bg-slate-900 text-rose-400 border-rose-500/40 ring-4 ring-rose-500/20"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Module Title Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-extrabold text-white">WhatsApp Birthday Engine</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-emerald-500/30">
                Live Enterprise API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated daily student birthday wishes, Meta Cloud API integration & delivery logging system.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleRunScheduler}
            disabled={isSchedulerRunning}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSchedulerRunning ? "animate-spin" : ""}`} />
            <span>{isSchedulerRunning ? "Running 08:00 AM Cron..." : "Run 8:00 AM Scheduler Now"}</span>
          </button>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700"
            title="Refresh WhatsApp Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "dashboard", label: "Dashboard Overview", icon: Gift, count: todayBirthdays.length },
          { id: "upcoming", label: "Upcoming (7-Days)", icon: Calendar, count: upcomingBirthdays.length },
          { id: "templates", label: "Message Templates", icon: FileText, count: templates.length },
          { id: "logs", label: "Delivery Logs & Reports", icon: Clock, count: logs.length },
          { id: "settings", label: "Provider & Settings", icon: SettingsIcon }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: DASHBOARD OVERVIEW */}
      {activeSubTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Today's Birthdays</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">{todayBirthdays.length}</div>
              <p className="text-[11px] text-amber-400 font-medium">Students celebrating today</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Sent Today</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">{sentTodayCount}</div>
              <p className="text-[11px] text-emerald-400 font-medium">Delivered via WhatsApp</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Failed / Retry</span>
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">{failedCount}</div>
              <p className="text-[11px] text-rose-400 font-medium">Requires attention</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Active Provider</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg font-extrabold text-white">{settings?.provider || "Mock"}</div>
              <p className="text-[11px] text-blue-400 font-medium">Cron: 08:00 AM Daily</p>
            </div>
          </div>

          {/* Today's Birthday Students Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" /> Today's Birthday Celebrations
                </h3>
                <p className="text-xs text-slate-400">Active students celebrating birthday today.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                {new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric" })}
              </span>
            </div>

            {todayBirthdays.length === 0 ? (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-10 text-center space-y-2">
                <Gift className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No Student Birthdays Today</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No active students have a birthday registered on today's date ({new Date().toLocaleDateString()}).
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {todayBirthdays.map((student) => {
                  const isSending = sendingStudentId === student.id;
                  const studentName = student.student_name || student.name || "Student";
                  const isSentToday =
                    locallySentIds.has(student.id) ||
                    logs.some(
                      (l) =>
                        (l.student_id === student.id || l.student_name === studentName) &&
                        (l.status === "Sent" || l.status === "sent") &&
                        new Date(l.created_at).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
                    );

                  return (
                    <div
                      key={student.id}
                      className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all shadow-md flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
                          {studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-extrabold text-sm text-white">{studentName}</h4>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                              Class {student.class}-{student.section || "A"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Adm: {student.admission_no || student.roll_no || student.id.substring(0, 6)}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-mono">📱 {student.parent_mobile || "9928623387"}</span>
                          </p>
                        </div>
                      </div>

                      {isSentToday ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Sent ✓</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSendWishNow(student)}
                          disabled={isSending}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all shrink-0 disabled:opacity-50"
                        >
                          <Send className={`w-3.5 h-3.5 ${isSending ? "animate-spin" : ""}`} />
                          <span>{isSending ? "Sending..." : "Send Wish Now"}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: UPCOMING BIRTHDAYS (7 / 30 DAYS) */}
      {activeSubTab === "upcoming" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Upcoming Birthdays Forecast
              </h3>
              <p className="text-xs text-slate-400">Scheduled birthday notifications for upcoming days.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Days ahead:</span>
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[7, 15, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setUpcomingDaysFilter(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      upcomingDaysFilter === d ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          {upcomingBirthdays.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-10 text-center text-slate-400">
              No birthdays found in the next {upcomingDaysFilter} days.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Class & Section</th>
                    <th className="py-3 px-4">Date of Birth</th>
                    <th className="py-3 px-4">Days Left</th>
                    <th className="py-3 px-4">Parent Phone</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {upcomingBirthdays.map((item) => {
                    const studentName = item.student_name || item.name || "Student";
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                            {studentName.charAt(0)}
                          </div>
                          <span>{studentName}</span>
                        </td>
                        <td className="py-3 px-4 font-medium">Class {item.class}-{item.section || "A"}</td>
                        <td className="py-3 px-4">{item.date_of_birth || item.dob || "N/A"}</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
                            {daysUntilBirthday(item.dob || item.date_of_birth) === 1 ? "Tomorrow" : `In ${daysUntilBirthday(item.dob || item.date_of_birth)} days`}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{item.parent_mobile || "9928623387"}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleSendWishNow(item)}
                            className="bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-bold px-3 py-1 rounded-lg transition-all"
                          >
                            Send Early Wish
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: MESSAGE TEMPLATES MANAGER */}
      {activeSubTab === "templates" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" /> WhatsApp Message Templates
              </h3>
              <p className="text-xs text-slate-400">Configure innovative student & teacher templates with dynamic variables.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={async () => {
                  if (confirm("Restore all 16 built-in templates (8 Student + 8 Teacher)?")) {
                    await resetDefaultTemplates();
                    await loadData();
                    showToast("🎉 16 Built-in Templates (8 Student + 8 Teacher) Restored!");
                  }
                }}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all border border-slate-700"
                title="Reset to 8 Student + 8 Teacher templates"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore 16 Templates</span>
              </button>

              <button
                onClick={() =>
                  setEditingTemplate({
                    name: "New Custom Template",
                    type: "birthday_student",
                    body: "🎉 Dear {{parent_name}},\n\nHappy Birthday to {{student_name}}! May your child excel in academics and life.\n\nRegards,\n{{school_name}}",
                    variables: ["student_name", "parent_name", "class", "school_name"],
                    is_active: true,
                    provider: "Meta"
                  })
                }
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>
          </div>

          {/* Template Type Filters */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setTemplateTypeFilter("all")}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                templateTypeFilter === "all"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All Templates ({templates.length})
            </button>
            <button
              onClick={() => setTemplateTypeFilter("birthday_student")}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                templateTypeFilter === "birthday_student"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-800 text-amber-400 hover:text-amber-300"
              }`}
            >
              🎒 Student Templates ({templates.filter(t => t.type === "birthday_student" || !t.type).length})
            </button>
            <button
              onClick={() => setTemplateTypeFilter("birthday_teacher")}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                templateTypeFilter === "birthday_teacher"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "bg-slate-800 text-emerald-400 hover:text-emerald-300"
              }`}
            >
              🎓 Teacher Templates ({templates.filter(t => t.type === "birthday_teacher").length})
            </button>
          </div>

          {/* Compact Template Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter((t) => {
                if (templateTypeFilter === "birthday_student") return t.type === "birthday_student" || !t.type;
                if (templateTypeFilter === "birthday_teacher") return t.type === "birthday_teacher";
                return true;
              })
              .map((tpl) => {
              const isTeacher = tpl.type === "birthday_teacher";
              return (
                <div
                  key={tpl.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-md flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase ${
                        isTeacher ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {isTeacher ? "🎓 Teacher Template" : "🎒 Student Template"}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          tpl.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {tpl.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white truncate" title={tpl.name}>{tpl.name}</h4>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-tight max-h-24 overflow-y-auto">
                      {tpl.body}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-mono truncate max-w-[120px]">
                      {tpl.variables?.slice(0, 3).map(v => `{{${v}}}`).join(" ")}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-all"
                        title="Preview Template"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingTemplate(tpl)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-md transition-all"
                        title="Edit Template"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete template "${tpl.name}"?`)) {
                            await deleteNotificationTemplate(tpl.id);
                            await loadData();
                            showToast("Template deleted");
                          }
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-md transition-all"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DELIVERY LOGS & EXPORT REPORTS */}
      {activeSubTab === "logs" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Delivery Logs & Audit Reports
              </h3>
              <p className="text-xs text-slate-400">Complete history of all WhatsApp notifications sent.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Report</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Student Name or Phone Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-bold">Status:</span>
              <select
                value={logStatusFilter}
                onChange={(e) => setLogStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Sent">Sent</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          {filteredLogs.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-10 text-center text-slate-500">
              No delivery logs match the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <th className="py-3 px-4">Student & Class</th>
                    <th className="py-3 px-4">Parent Phone</th>
                    <th className="py-3 px-4">Template Used</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{log.student_name || log.student_id}</div>
                        <div className="text-[10px] text-slate-500">Class {log.class || "N/A"}-{log.section || "A"}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">{log.parent_mobile}</td>
                      <td className="py-3 px-4 max-w-[150px] truncate">{log.template_used}</td>
                      <td className="py-3 px-4 font-bold text-amber-400">{log.provider}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                            log.status === "Sent"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : log.status === "Failed"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(log.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {log.status === "Failed" && (
                          <button
                            onClick={() => handleRetryLog(log.id)}
                            className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
                          >
                            Retry Send
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: SETTINGS & PROVIDER CONFIGURATION */}
      {activeSubTab === "settings" && settings && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSettingsSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-amber-400" /> WhatsApp Provider Settings
                </h3>
                <p className="text-xs text-slate-400">Configure Meta Cloud API credentials, Cron schedule & provider selection.</p>
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all"
              >
                Save Settings
              </button>
            </div>

            {/* Provider Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Active WhatsApp Gateway Provider</label>
                <select
                  value={settings.provider}
                  onChange={(e) => setSettings({ ...settings, provider: e.target.value as WhatsAppProviderType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="Mock">Mock WhatsApp Simulator (Instant Zero-Credential Test)</option>
                  <option value="OpenWA">OpenWA Self-Hosted Gateway (Free Open-Source)</option>
                  <option value="Meta">Meta WhatsApp Cloud API (Official)</option>
                  <option value="WATI">WATI WhatsApp API</option>
                  <option value="AiSensy">AiSensy Platform</option>
                  <option value="Interakt">Interakt Official</option>
                  <option value="Twilio">Twilio WhatsApp API</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Daily Cron Sending Time</label>
                <input
                  type="text"
                  value={settings.send_time}
                  onChange={(e) => setSettings({ ...settings, send_time: e.target.value })}
                  placeholder="08:00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* School & Principal Customization */}
            <div className="grid md:grid-cols-2 gap-6 border-t border-slate-800 pt-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">School Name</label>
                <input
                  type="text"
                  value={settings.school_name}
                  onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Principal Name</label>
                <input
                  type="text"
                  value={settings.principal_name}
                  onChange={(e) => setSettings({ ...settings, principal_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* API Credentials Section */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                API Credentials ({settings.provider})
              </h4>

              {settings.provider === "OpenWA" && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400">OpenWA API Base URL</label>
                    <input
                      type="text"
                      value={settings.api_credentials?.openwa_api_url || "http://localhost:2785"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          api_credentials: { ...settings.api_credentials, openwa_api_url: e.target.value }
                        })
                      }
                      placeholder="http://localhost:2785"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-400">OpenWA API Key (X-API-Key)</label>
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1"
                      >
                        {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showApiKey ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={settings.api_credentials?.openwa_api_key || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          api_credentials: { ...settings.api_credentials, openwa_api_key: e.target.value }
                        })
                      }
                      placeholder="YOUR_OPENWA_API_KEY"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400">OpenWA Session ID</label>
                    <input
                      type="text"
                      value={settings.api_credentials?.openwa_session_id || "default"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          api_credentials: { ...settings.api_credentials, openwa_session_id: e.target.value }
                        })
                      }
                      placeholder="default"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {settings.provider === "Meta" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400">Meta Phone Number ID</label>
                    <input
                      type="text"
                      value={settings.api_credentials?.meta_phone_number_id || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          api_credentials: { ...settings.api_credentials, meta_phone_number_id: e.target.value }
                        })
                      }
                      placeholder="100982391298..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-400">Meta System Access Token</label>
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1"
                      >
                        {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showApiKey ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={settings.api_credentials?.meta_access_token || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          api_credentials: { ...settings.api_credentials, meta_access_token: e.target.value }
                        })
                      }
                      placeholder="EAAG..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {settings.provider === "Mock" && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-400">
                  ⚡ <strong>Mock Simulator Active</strong>: Messages will be simulated instantly with realistic delivery response IDs. No third-party credentials required!
                </div>
              )}
            </div>
          </form>

          {/* Test WhatsApp Message Sender Drawer */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-heading font-extrabold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" /> Send Diagnostic Test WhatsApp Message
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Enter parent mobile number (+919928623387)..."
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleSendTestMessage}
                disabled={isSendingTest}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingTest ? "animate-spin" : ""}`} />
                <span>{isSendingTest ? "Delivering..." : "Send Test Message"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE EDIT MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-extrabold text-white text-base">
                {editingTemplate.id ? "Edit WhatsApp Template" : "Create New Template"}
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Template Title</label>
                  <input
                    type="text"
                    value={editingTemplate.name || ""}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Target Type (Recipient)</label>
                  <select
                    value={editingTemplate.type || "birthday_student"}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500 mt-1"
                  >
                    <option value="birthday_student">🎒 Student Birthday Template</option>
                    <option value="birthday_teacher">🎓 Teacher Birthday Template</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Message Body & Placeholders</label>
                <textarea
                  rows={6}
                  value={editingTemplate.body || ""}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Click to Insert Dynamic Variable:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["student_name", "parent_name", "class", "section", "school_name", "principal_name", "today"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() =>
                        setEditingTemplate({
                          ...editingTemplate,
                          body: (editingTemplate.body || "") + ` {{${v}}}`
                        })
                      }
                      className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-lg hover:bg-amber-500 hover:text-slate-950 transition-all"
                    >
                      {`+ {{${v}}}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (editingTemplate.name && editingTemplate.body) {
                    await saveNotificationTemplate(editingTemplate);
                    await loadData();
                    setEditingTemplate(null);
                    showToast("Template saved!");
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP CHAT BUBBLE PREVIEW MODAL */}
      {previewTemplate && settings && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Live Preview
              </h3>
              <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Phone Screen */}
            <div className="bg-[#0b141a] rounded-2xl p-4 border border-slate-800 shadow-inner space-y-2">
              <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tl-none text-xs leading-relaxed whitespace-pre-wrap shadow">
                {renderWhatsAppTemplate(previewTemplate.body, {
                  student: {
                    id: "preview",
                    student_name: "Aarav Sharma",
                    class: "X",
                    section: "A",
                    father_name: "Mr. Rajesh Sharma"
                  },
                  settings
                })}
                <div className="text-[9px] text-right text-emerald-200 mt-1 font-mono">08:00 AM ✓✓</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
