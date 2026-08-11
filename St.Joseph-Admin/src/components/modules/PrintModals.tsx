import React from "react";
import { Student, FeeReceiptRecord } from "../../lib/db";
import { Award, Receipt, Printer, X } from "lucide-react";

interface PrintReportCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export const PrintReportCardModal: React.FC<PrintReportCardModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-heading font-extrabold text-white text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> CBSE Progress Report Card — {student.name || student.student_name}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Marksheet Card */}
        <div id="printable-report-card" className="bg-white text-slate-900 p-8 rounded-2xl space-y-6 shadow-xl font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-amber-500 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-950 uppercase tracking-tight">
              ST. JOSEPH'S INTERNATIONAL SCHOOL
            </h2>
            <p className="text-xs font-bold text-slate-600">CBSE Affiliated Senior Secondary School • Dholpur (Raj.)</p>
            <p className="text-xs text-slate-500">ACADEMIC PROGRESS REPORT CARD (2026-2027)</p>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 text-xs font-medium border-b border-slate-200 pb-4">
            <div>
              <p>Student Name: <strong className="text-slate-950">{student.name || student.student_name}</strong></p>
              <p>Father Name: <strong className="text-slate-950">{student.father_name || "N/A"}</strong></p>
            </div>
            <div>
              <p>Class & Sec: <strong className="text-slate-950">{student.class} - {student.section || "A"}</strong></p>
              <p>Roll / SR No: <strong className="text-slate-950">{student.admission_no || student.roll_no || "1001"}</strong></p>
            </div>
          </div>

          {/* Marks Table */}
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300">Subject</th>
                <th className="p-2 border-r border-slate-300">Max Marks</th>
                <th className="p-2 border-r border-slate-300">Marks Obtained</th>
                <th className="p-2">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr><td className="p-2 border-r">English Literature</td><td className="p-2 border-r">100</td><td className="p-2 border-r font-bold">92</td><td className="p-2 font-bold text-emerald-600">A1</td></tr>
              <tr><td className="p-2 border-r">Mathematics</td><td className="p-2 border-r">100</td><td className="p-2 border-r font-bold">95</td><td className="p-2 font-bold text-emerald-600">A1</td></tr>
              <tr><td className="p-2 border-r">Science & Tech</td><td className="p-2 border-r">100</td><td className="p-2 border-r font-bold">88</td><td className="p-2 font-bold text-emerald-600">A2</td></tr>
              <tr><td className="p-2 border-r">Social Science</td><td className="p-2 border-r">100</td><td className="p-2 border-r font-bold">90</td><td className="p-2 font-bold text-emerald-600">A1</td></tr>
              <tr><td className="p-2 border-r">Hindi Core</td><td className="p-2 border-r">100</td><td className="p-2 border-r font-bold">89</td><td className="p-2 font-bold text-emerald-600">A2</td></tr>
            </tbody>
          </table>

          {/* Result Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
            <div>
              <p>Percentage: <strong className="text-emerald-700 text-sm">90.8%</strong></p>
              <p>Overall Result: <strong className="text-emerald-700 font-bold uppercase">PASSED WITH DISTINCTION ✓</strong></p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px]">Principal / Controller Signature</p>
              <p className="font-bold text-slate-900 mt-4">Mr. Praveen Tyagi</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report Card PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface PrintFeeReceiptModalProps {
  receipt: FeeReceiptRecord | null;
  onClose: () => void;
}

export const PrintFeeReceiptModal: React.FC<PrintFeeReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-heading font-extrabold text-white text-base flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" /> Fee Payment Receipt — {receipt.receipt_no}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Fee Receipt Card */}
        <div id="printable-fee-receipt" className="bg-white text-slate-900 p-6 rounded-2xl space-y-4 shadow-xl font-sans text-xs">
          <div className="text-center border-b-2 border-emerald-500 pb-3">
            <h2 className="text-xl font-extrabold text-slate-950 uppercase">ST. JOSEPH'S INTERNATIONAL SCHOOL</h2>
            <p className="text-[10px] text-slate-600 font-bold">FEE PAYMENT RECEIPT • DHOLPUR (RAJASTHAN)</p>
          </div>

          <div className="grid grid-cols-2 gap-2 font-medium">
            <p>Receipt No: <strong className="text-slate-950 font-mono">{receipt.receipt_no}</strong></p>
            <p>Date: <strong className="text-slate-950 font-mono">{receipt.payment_date}</strong></p>
            <p>Student Name: <strong className="text-slate-950">{receipt.student_name}</strong></p>
            <p>Class: <strong className="text-slate-950">{receipt.class}</strong></p>
          </div>

          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-slate-600 font-bold">Particulars</p>
              <p className="text-slate-950 font-bold text-sm mt-0.5">{receipt.remarks}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-600 font-bold">Amount Paid</p>
              <p className="text-emerald-700 font-extrabold text-lg font-mono">₹{receipt.amount_paid}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2">
            <p>Payment Mode: <strong className="text-slate-900">{receipt.payment_mode}</strong></p>
            <p>Accounts Signature: <strong className="text-slate-900">Authorized Signatory ✓</strong></p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
