import React, { useState } from "react";
import { Student, FeeReceiptRecord } from "../../lib/db";
import { Receipt, IndianRupee, Printer, Plus, Search, CheckCircle2 } from "lucide-react";

interface FeeCollectionsModuleProps {
  students: Student[];
  feeCollections: FeeReceiptRecord[];
  onSaveFeeCollection: (record: FeeReceiptRecord) => Promise<void>;
  onSelectPrintReceipt: (receipt: FeeReceiptRecord) => void;
}

export const FeeCollectionsModule: React.FC<FeeCollectionsModuleProps> = ({
  students,
  feeCollections,
  onSaveFeeCollection,
  onSelectPrintReceipt
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState<"Cash" | "UPI" | "Cheque" | "NetBanking">("UPI");
  const [remarks, setRemarks] = useState("Quarter 1 Tuition Fee");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCollectFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !amountPaid) return;

    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    setIsSubmitting(true);
    try {
      const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const studentName = student.student_name || student.name;

      const newReceipt: FeeReceiptRecord = {
        id: `rec_${Date.now()}`,
        receipt_no: receiptNo,
        student_id: student.id,
        student_name: studentName,
        class: student.class,
        amount_paid: Number(amountPaid),
        payment_mode: paymentMode,
        payment_date: new Date().toISOString().split("T")[0],
        remarks: remarks
      };

      await onSaveFeeCollection(newReceipt);
      onSelectPrintReceipt(newReceipt);
      setAmountPaid("");
      setRemarks("Quarter 1 Tuition Fee");
    } catch (err) {
      console.error("Fee collection error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-amber-400" /> Fee Receipt Collection & Billing
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Collect Cash/UPI student fee payments and print official St. Joseph School payment receipts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Collect Fee */}
        <form onSubmit={handleCollectFeeSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-400" /> Collect New Fee Payment
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Select Student *</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-amber-400 focus:outline-none"
              >
                <option value="">-- Choose Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.student_name || s.name} ({s.class})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Amount Paid (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e: any) => setPaymentMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-amber-400 focus:outline-none font-bold"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Cash">Cash Payment</option>
                <option value="Cheque">Cheque Payment</option>
                <option value="Bank Transfer">Bank Transfer / NEFT</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Remarks / Month</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Receipt className="w-4 h-4" />
              <span>{isSubmitting ? "Generating..." : "Collect & Print Receipt"}</span>
            </button>
          </div>
        </form>

        {/* Recent Fee Receipts History */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recent Fee Receipts Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Receipt No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Amount Paid</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3 text-right">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {feeCollections.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">{receipt.receipt_no}</td>
                    <td className="py-3 px-3 font-extrabold text-white">{receipt.student_name}</td>
                    <td className="py-3 px-3 text-slate-400">{receipt.class}</td>
                    <td className="py-3 px-3 font-extrabold text-emerald-400 font-mono">₹{receipt.amount_paid}</td>
                    <td className="py-3 px-3 font-bold text-slate-300">{receipt.payment_mode}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectPrintReceipt(receipt)}
                        className="p-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 rounded-xl transition-all"
                        title="Print Receipt PDF"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
