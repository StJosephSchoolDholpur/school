import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check, User, Users, School, FileText, Building2, CheckCircle2 } from "lucide-react";
import { Student } from "../lib/db";

interface StudentAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStudent: (studentData: Partial<Student>) => Promise<void>;
}

export const StudentAdmissionModal: React.FC<StudentAdmissionModalProps> = ({
  isOpen,
  onClose,
  onSaveStudent,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Auto Generate Form Serial No
  const [formData, setFormData] = useState<Partial<Student>>({
    form_no: `FORM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    session: "2026-2027",
    name: "",
    dob: "2020-03-15",
    age_march31: "",
    blood_group: "O+",
    class: "Class Nursery",
    nationality: "Indian",
    religion: "Hinduism",
    category: "General",
    gender: "Male",
    medical_condition: "None",
    address: "",
    city_state: "Dholpur, Rajasthan",
    pincode: "328001",
    whatsapp_no: "",
    parent_mobile: "",

    // Mother
    mother_name: "",
    mother_age: "",
    mother_qualification: "Graduate",
    mother_profession: "Homemaker",
    mother_city_state: "Dholpur, Rajasthan",
    mother_whatsapp: "",
    mother_email: "",

    // Father
    father_name: "",
    father_age: "",
    father_qualification: "Post Graduate",
    father_profession: "Business",
    father_city_state: "Dholpur, Rajasthan",
    father_whatsapp: "",
    father_email: "",

    // Previous School & Sibling
    previous_school_name: "",
    previous_class: "",
    previous_medium: "English",
    previous_board: "CBSE",
    previous_school_address: "",
    previous_marks: "",
    has_sibling: false,
    sibling_name: "",
    sibling_admission_no: "",
    sibling_class: "",

    // Office Use
    admission_date: new Date().toISOString().split("T")[0],
    admission_no: `SJ-2026-${Math.floor(100 + Math.random() * 900)}`,
    transport_required: true,
    total_fees: 28500,
    documents_submitted: ["Aadhaar", "DOB Certificate", "Photo"],
    councillor_sign: "Approved by Admission Cell",
    accountant_sign: "Accounts Verified",
    photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
  });

  // Calculate age as of March 31st of the session year
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const targetDate = new Date(2026, 2, 31); // March 31, 2026
      let years = targetDate.getFullYear() - birthDate.getFullYear();
      let months = targetDate.getMonth() - birthDate.getMonth();
      if (months < 0 || (months === 0 && targetDate.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
      }
      setFormData((prev) => ({ ...prev, age_march31: `${years} Yrs ${months} Mos` }));
    }
  }, [formData.dob]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.dob)) {
      return alert("Please enter Child Name and Date of Birth!");
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSaveStudent(formData);
      alert("🎉 Student Admission Form Submitted & Registered Successfully!");
      onClose();
    } catch (err) {
      alert("Error saving admission form!");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDocument = (doc: string) => {
    const list = formData.documents_submitted || [];
    if (list.includes(doc)) {
      setFormData({ ...formData, documents_submitted: list.filter((d) => d !== doc) });
    } else {
      setFormData({ ...formData, documents_submitted: [...list, doc] });
    }
  };

  const steps = [
    { num: 1, label: "Child Info", icon: User },
    { num: 2, label: "Parents Detail", icon: Users },
    { num: 3, label: "Prev School & Sibling", icon: School },
    { num: 4, label: "Undertaking", icon: FileText },
    { num: 5, label: "Office & Fees", icon: Building2 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              St. Joseph's Admission Portal
            </span>
            <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              New Student Admission Registration Form
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              {formData.form_no}
            </span>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between">
            {steps.map((s) => {
              const IconComp = s.icon;
              const isActive = currentStep === s.num;
              const isCompleted = currentStep > s.num;
              return (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? "bg-emerald-500 text-slate-950"
                        : isActive
                        ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-bold hidden md:inline ${
                      isActive ? "text-amber-400" : isCompleted ? "text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    {s.label}
                  </span>
                  {s.num < 5 && <ChevronRight className="w-4 h-4 text-slate-700 hidden md:inline ml-2" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* PAGE 1: CHILD BASIC INFO */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in slide-in-from-right duration-200">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-heading font-extrabold text-amber-400 text-sm">Page 1: Student Basic Information & Contact</h3>
                <p className="text-[11px] text-slate-400">Fill details about the child seeking admission.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Form Serial No. (Auto)</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.form_no}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Session *</label>
                  <input
                    type="text"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Admission Sought in Class *</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold"
                  >
                    {["Class Nursery", "Class LKG", "Class UKG", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Name of Child *</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
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
                  <label className="block text-slate-400 font-bold mb-1">Age as on 31st March (Auto)</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.age_march31}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold"
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
                  <label className="block text-slate-400 font-bold mb-1">Blood Group</label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Nationality</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Religion</label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Suffering from Any Disease?</label>
                  <input
                    type="text"
                    placeholder="e.g. None / Asthma"
                    value={formData.medical_condition}
                    onChange={(e) => setFormData({ ...formData, medical_condition: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="e.g. House No. 42, GT Road, Dholpur"
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
                  <label className="block text-slate-400 font-bold mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">WhatsApp Mobile No.</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9829123456"
                    value={formData.whatsapp_no}
                    onChange={(e) => setFormData({ ...formData, whatsapp_no: e.target.value, parent_mobile: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: PARENTS DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-200">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-heading font-extrabold text-amber-400 text-sm">Page 2: Parents & Guardian Information</h3>
                <p className="text-[11px] text-slate-400">Complete background details of Mother and Father.</p>
              </div>

              {/* Mother Details */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span> Mother's Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Mother Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mrs. Sunita Sharma"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Age</label>
                    <input
                      type="text"
                      placeholder="e.g. 34 Yrs"
                      value={formData.mother_age}
                      onChange={(e) => setFormData({ ...formData, mother_age: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Academic Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. M.A., B.Ed"
                      value={formData.mother_qualification}
                      onChange={(e) => setFormData({ ...formData, mother_qualification: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Profession / Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Homemaker / Teacher"
                      value={formData.mother_profession}
                      onChange={(e) => setFormData({ ...formData, mother_profession: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">WhatsApp Mobile</label>
                    <input
                      type="text"
                      placeholder="+91 98291..."
                      value={formData.mother_whatsapp}
                      onChange={(e) => setFormData({ ...formData, mother_whatsapp: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="mother@gmail.com"
                      value={formData.mother_email}
                      onChange={(e) => setFormData({ ...formData, mother_email: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Father Details */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span> Father's Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Father Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mr. Rajendra Sharma"
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Age</label>
                    <input
                      type="text"
                      placeholder="e.g. 38 Yrs"
                      value={formData.father_age}
                      onChange={(e) => setFormData({ ...formData, father_age: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Academic Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech / M.Com"
                      value={formData.father_qualification}
                      onChange={(e) => setFormData({ ...formData, father_qualification: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Profession / Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Business / Govt Service"
                      value={formData.father_profession}
                      onChange={(e) => setFormData({ ...formData, father_profession: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">WhatsApp Mobile</label>
                    <input
                      type="text"
                      placeholder="+91 98291..."
                      value={formData.father_whatsapp}
                      onChange={(e) => setFormData({ ...formData, father_whatsapp: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="father@gmail.com"
                      value={formData.father_email}
                      onChange={(e) => setFormData({ ...formData, father_email: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: PREVIOUS SCHOOL & SIBLING */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-200">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-heading font-extrabold text-amber-400 text-sm">Page 3: Previous Academic History & Sibling Detail</h3>
                <p className="text-[11px] text-slate-400">Previous school performance and details of any studying sibling.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h4 className="font-bold text-white text-xs">Current / Previous School Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 font-bold mb-1">School Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Central Public Academy"
                      value={formData.previous_school_name}
                      onChange={(e) => setFormData({ ...formData, previous_school_name: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Last Class Passed</label>
                    <input
                      type="text"
                      placeholder="e.g. Class UKG"
                      value={formData.previous_class}
                      onChange={(e) => setFormData({ ...formData, previous_class: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Medium of Instruction</label>
                    <select
                      value={formData.previous_medium}
                      onChange={(e) => setFormData({ ...formData, previous_medium: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Board of Affiliation</label>
                    <select
                      value={formData.previous_board}
                      onChange={(e) => setFormData({ ...formData, previous_board: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="RBSE / State Board">RBSE / State Board</option>
                      <option value="ICSE">ICSE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Previous Year Marks / Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. 88.5% or A1"
                      value={formData.previous_marks}
                      onChange={(e) => setFormData({ ...formData, previous_marks: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Sibling Check */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">Any Sibling Currently Studying in St. Joseph's School?</h4>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, has_sibling: !formData.has_sibling })}
                    className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                      formData.has_sibling ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {formData.has_sibling ? "YES" : "NO"}
                  </button>
                </div>

                {formData.has_sibling && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Sibling Name</label>
                      <input
                        type="text"
                        placeholder="Sibling full name"
                        value={formData.sibling_name}
                        onChange={(e) => setFormData({ ...formData, sibling_name: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Sibling Admission No.</label>
                      <input
                        type="text"
                        placeholder="e.g. SJ-2024-042"
                        value={formData.sibling_admission_no}
                        onChange={(e) => setFormData({ ...formData, sibling_admission_no: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Sibling Class</label>
                      <input
                        type="text"
                        placeholder="e.g. Class V"
                        value={formData.sibling_class}
                        onChange={(e) => setFormData({ ...formData, sibling_class: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAGE 4: UNDERTAKING & PHOTOS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-200">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-heading font-extrabold text-amber-400 text-sm">Page 4: Parent Declaration & Photos Undertaking</h3>
                <p className="text-[11px] text-slate-400">Verifying declarations and passport photos/signatures of Mother, Father, and Guardian.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Mother Photo & Signature", color: "border-pink-500/30" },
                  { title: "Father Photo & Signature", color: "border-blue-500/30" },
                  { title: "Guardian Photo & Signature", color: "border-amber-500/30" },
                ].map((item, i) => (
                  <div key={i} className={`bg-slate-950 border ${item.color} rounded-2xl p-4 text-center space-y-3`}>
                    <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-bold">
                      <User className="w-8 h-8" />
                    </div>
                    <h5 className="font-bold text-white text-xs">{item.title}</h5>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg inline-block border border-emerald-500/20 font-bold">
                      ✓ Signature Verified
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-white text-xs">Parent Declaration Terms:</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  I hereby declare that the details provided in this admission form are true and accurate to the best of my knowledge. I agree to abide by the rules, regulations, and fee schedules of St. Joseph's International School.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <input type="checkbox" defaultChecked id="undertaking-check" className="w-4 h-4 rounded accent-amber-500" />
                  <label htmlFor="undertaking-check" className="text-xs font-bold text-amber-400 cursor-pointer">
                    I accept all parent declarations and rules.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 5: FOR OFFICE USE ONLY & FEES */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-200">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-heading font-extrabold text-amber-400 text-sm">Page 5: For Office Use Only & Fee Allocation</h3>
                <p className="text-[11px] text-slate-400">Final administrative approval, document checklist, and fee confirmation.</p>
              </div>

              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">OFFICE APPROVAL SHEET</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Date of Admission</label>
                    <input
                      type="date"
                      value={formData.admission_date}
                      onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Form Number (Auto)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.form_no}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Assigned Admission No. *</label>
                    <input
                      type="text"
                      value={formData.admission_no}
                      onChange={(e) => setFormData({ ...formData, admission_no: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Child Name (Auto)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.name}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Class Admitted (Auto)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.class}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Transport Required?</label>
                    <select
                      value={formData.transport_required ? "YES" : "NO"}
                      onChange={(e) => setFormData({ ...formData, transport_required: e.target.value === "YES" })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    >
                      <option value="YES">YES (School Bus)</option>
                      <option value="NO">NO (Self Transport)</option>
                    </select>
                  </div>
                </div>

                {/* Documents Checklist */}
                <div className="pt-2">
                  <label className="block text-slate-400 font-bold mb-2">Documents Submitted Checklist:</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {["Aadhaar Card", "Transfer Certificate (TC)", "Previous Marksheet", "DOB Certificate", "Passport Photo"].map((doc) => {
                      const checked = (formData.documents_submitted || []).includes(doc);
                      return (
                        <div
                          key={doc}
                          onClick={() => toggleDocument(doc)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            checked
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          <span className="text-[11px]">{doc}</span>
                          {checked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Signature of Admission Councillor</label>
                    <input
                      type="text"
                      value={formData.councillor_sign}
                      onChange={(e) => setFormData({ ...formData, councillor_sign: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Signature of Accountant</label>
                    <input
                      type="text"
                      value={formData.accountant_sign}
                      onChange={(e) => setFormData({ ...formData, accountant_sign: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs font-bold text-slate-500">
              Page {currentStep} of 5
            </span>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                Next Page <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> {submitting ? "Saving Form..." : "Submit & Register Student"}
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
