import React, { useState, useEffect } from "react";
import { X, Check, GraduationCap, User, Phone, Mail, Award, BookOpen, Briefcase, CheckCircle2 } from "lucide-react";
import { Teacher } from "../lib/db";

interface TeacherRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTeacher: (teacherData: Partial<Teacher>) => Promise<void>;
}

export const TeacherRegistrationModal: React.FC<TeacherRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSaveTeacher,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const getInitialFormData = (): Partial<Teacher> => ({
    emp_id: `EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    name: "",
    gender: "Male",
    designation: "PGT Mathematics",
    department: "Science & Math",
    dob: "",
    joining_date: new Date().toISOString().split("T")[0],
    qualification: "",
    experience_years: "",
    subjects_taught: "",
    classes_assigned: "",
    phone: "",
    email: "",
    address: "",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    blood_group: "O+",
    aadhaar_no: "",
    pan_no: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    pay_grade: "Grade A",
    is_active: true,
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    wishes: "Wishing you a joyful and prosperous birthday from St. Joseph School family!",
  });

  const [formData, setFormData] = useState<Partial<Teacher>>(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.designation) {
      return alert("Please fill Teacher Name, Designation, and Date of Birth!");
    }
    setSubmitting(true);
    try {
      await onSaveTeacher(formData);
      alert("🎉 Teacher Faculty Record Registered Successfully!");
      onClose();
    } catch (err) {
      alert("Error saving teacher registration!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                St. Joseph's HR & Faculty Management
              </span>
              <h2 className="text-xl font-heading font-extrabold text-white">
                Teacher Faculty Registration Form
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              {formData.emp_id}
            </span>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* SECTION 1: PERSONAL & CONTACT */}
          <div className="space-y-4">
            <h3 className="font-heading font-extrabold text-amber-400 text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="w-4 h-4" /> 1. Personal & Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Employee ID (Auto)</label>
                <input
                  type="text"
                  readOnly
                  value={formData.emp_id}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Praveen Tyagi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Date of Birth (DOB) *</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Date of Joining</label>
                <input
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">WhatsApp Phone No. *</label>
                <input
                  type="text"
                  placeholder="e.g. +91 9829123456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. teacher@stjoseph.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC & FACULTY APPOINTMENT */}
          <div className="space-y-4">
            <h3 className="font-heading font-extrabold text-amber-400 text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <Briefcase className="w-4 h-4" /> 2. Designation & Faculty Subjects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Designation *</label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold"
                >
                  <option value="PGT Mathematics">PGT Mathematics</option>
                  <option value="PGT Physics">PGT Physics</option>
                  <option value="PGT Chemistry">PGT Chemistry</option>
                  <option value="TGT Science">TGT Science</option>
                  <option value="TGT English">TGT English</option>
                  <option value="PRT General">PRT Primary Teacher</option>
                  <option value="Sports Instructor">Sports Instructor</option>
                  <option value="Arts Teacher">Arts Teacher</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="Science & Math">Science & Math</option>
                  <option value="Languages">Languages</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Sports & PE">Sports & PE</option>
                  <option value="Arts & Cultural">Arts & Cultural</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Academic Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. M.Sc. Mathematics, B.Ed"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Total Teaching Exp. (Yrs)</label>
                <input
                  type="text"
                  placeholder="e.g. 6 Years"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Subjects Taught</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Statistics"
                  value={formData.subjects_taught}
                  onChange={(e) => setFormData({ ...formData, subjects_taught: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Classes Assigned</label>
                <input
                  type="text"
                  placeholder="e.g. Class IX, Class X"
                  value={formData.classes_assigned}
                  onChange={(e) => setFormData({ ...formData, classes_assigned: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ADDRESS & EMERGENCY */}
          <div className="space-y-4">
            <h3 className="font-heading font-extrabold text-amber-400 text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <Award className="w-4 h-4" /> 3. Address & Emergency Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. Civil Lines, Near Circuit House, Dholpur"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">City / State</label>
                <input
                  type="text"
                  value={formData.city_state}
                  onChange={(e) => setFormData({ ...formData, city_state: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Aadhaar Card No.</label>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar"
                  value={formData.aadhaar_no}
                  onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Relative Name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Emergency Phone No.</label>
                <input
                  type="text"
                  placeholder="+91 9829..."
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> {submitting ? "Registering..." : "Submit Teacher Registration"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
