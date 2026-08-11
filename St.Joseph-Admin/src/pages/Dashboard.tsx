import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { StudentAdmissionModal } from "../components/StudentAdmissionModal";
import {
  fetchTCs,
  uploadAndSaveTC,
  deleteTCRecord,
  fetchTeachers,
  saveTeacherRecord,
  deleteTeacherRecord,
  fetchStudents,
  saveStudentRecord,
  deleteStudentRecord,
  fetchTransportRoutes,
  saveTransportRoute,
  deleteTransportRoute,
  fetchAttendance,
  saveAttendanceRecords,
  fetchExamMarks,
  fetchFeeCollections,
  saveFeeCollectionRecord,
  TCRecordData,
  Teacher,
  Student,
  AttendanceRecord,
  ExamMarkRecord,
  FeeReceiptRecord,
  TransportRoute
} from "../lib/db";

// Modular Sub-Components
import { StudentManagementModule } from "../components/modules/StudentManagementModule";
import { TeacherManagementModule } from "../components/modules/TeacherManagementModule";
import { AttendanceModule } from "../components/modules/AttendanceModule";
import { ExaminationsModule } from "../components/modules/ExaminationsModule";
import { FeeCollectionsModule } from "../components/modules/FeeCollectionsModule";
import { TcPortalModule } from "../components/modules/TcPortalModule";
import { TransportModule } from "../components/modules/TransportModule";
import { OverviewModule } from "../components/modules/OverviewModule";
import { PrintReportCardModal, PrintFeeReceiptModal } from "../components/modules/PrintModals";

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State Stores
  const [tcs, setTcs] = useState<TCRecordData[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [examMarks, setExamMarks] = useState<ExamMarkRecord[]>([]);
  const [feeCollections, setFeeCollections] = useState<FeeReceiptRecord[]>([]);

  // Modal & Print States
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);
  const [printReceipt, setPrintReceipt] = useState<FeeReceiptRecord | null>(null);

  // Load All Database Stores
  const loadData = async () => {
    try {
      const [
        fetchedTcs,
        fetchedTeachers,
        fetchedStudents,
        fetchedRoutes,
        fetchedAtt,
        fetchedMarks,
        fetchedReceipts
      ] = await Promise.all([
        fetchTCs(),
        fetchTeachers(),
        fetchStudents(),
        fetchTransportRoutes(),
        fetchAttendance(),
        fetchExamMarks(),
        fetchFeeCollections()
      ]);

      setTcs(fetchedTcs);
      setTeachers(fetchedTeachers);
      setStudents(fetchedStudents);
      setRoutes(fetchedRoutes);
      setAttendanceLogs(fetchedAtt);
      setExamMarks(fetchedMarks);
      setFeeCollections(fetchedReceipts);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Students
  const handleSaveStudent = async (student: Omit<Student, "id"> & { id?: string }) => {
    await saveStudentRecord(student);
    await loadData();
  };

  const handleDeleteStudent = async (id: string) => {
    await deleteStudentRecord(id);
    await loadData();
  };

  // Handlers for Teachers
  const handleSaveTeacher = async (teacher: Omit<Teacher, "id"> & { id?: string }) => {
    await saveTeacherRecord(teacher);
    await loadData();
  };

  const handleDeleteTeacher = async (id: string) => {
    await deleteTeacherRecord(id);
    await loadData();
  };

  // Handlers for TCs
  const handleUploadTC = async (file: File | null, record: Omit<TCRecordData, "id" | "file_path" | "file_url" | "created_at">) => {
    await uploadAndSaveTC(file, record);
    await loadData();
  };

  const handleDeleteTC = async (id: string) => {
    await deleteTCRecord(id);
    await loadData();
  };

  // Handlers for Routes
  const handleSaveRoute = async (route: Omit<TransportRoute, "id"> & { id?: string }) => {
    await saveTransportRoute(route);
    await loadData();
  };

  const handleDeleteRoute = async (id: string) => {
    await deleteTransportRoute(id);
    await loadData();
  };

  // Handlers for Attendance
  const handleSaveAttendance = async (records: AttendanceRecord[]) => {
    await saveAttendanceRecords(records);
    await loadData();
  };

  // Handlers for Fee Collections
  const handleSaveFeeCollection = async (record: FeeReceiptRecord) => {
    await saveFeeCollectionRecord(record);
    await loadData();
  };

  const path = location.pathname;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {/* Module Switcher based on Route Path */}
        {(path === "/" || path === "/dashboard") && (
          <OverviewModule
            students={students}
            teachers={teachers}
            tcs={tcs}
            routes={routes}
            onNavigateTab={(targetPath: string) => navigate(targetPath.startsWith("/") ? targetPath : `/${targetPath}`)}
          />
        )}

        {path === "/students" && (
          <StudentManagementModule
            students={students}
            onSaveStudent={handleSaveStudent}
            onDeleteStudent={handleDeleteStudent}
            onOpenAdmissionModal={() => setIsAdmissionModalOpen(true)}
          />
        )}

        {path === "/teachers" && (
          <TeacherManagementModule
            teachers={teachers}
            onSaveTeacher={handleSaveTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        )}

        {path === "/attendance" && (
          <AttendanceModule
            students={students}
            teachers={teachers}
            attendanceLogs={attendanceLogs}
            onSaveAttendance={handleSaveAttendance}
          />
        )}

        {path === "/examinations" && (
          <ExaminationsModule
            students={students}
            examMarks={examMarks}
            onSaveMarks={async () => {}}
            onSelectPrintReportCard={setReportCardStudent}
          />
        )}

        {path === "/fee-collections" && (
          <FeeCollectionsModule
            students={students}
            feeCollections={feeCollections}
            onSaveFeeCollection={handleSaveFeeCollection}
            onSelectPrintReceipt={setPrintReceipt}
          />
        )}

        {path === "/tc" && (
          <TcPortalModule
            tcs={tcs}
            onUploadAndSaveTC={handleUploadTC}
            onDeleteTC={handleDeleteTC}
          />
        )}

        {path === "/transport" && (
          <TransportModule
            routes={routes}
            onSaveRoute={handleSaveRoute}
            onDeleteRoute={handleDeleteRoute}
          />
        )}

        {/* Multi-Step Admission Registration Modal */}
        <StudentAdmissionModal
          isOpen={isAdmissionModalOpen}
          onClose={() => setIsAdmissionModalOpen(false)}
          onSaveStudent={handleSaveStudent}
        />

        {/* Report Card & Fee Receipt Print Modals */}
        <PrintReportCardModal
          student={reportCardStudent}
          onClose={() => setReportCardStudent(null)}
        />

        <PrintFeeReceiptModal
          receipt={printReceipt}
          onClose={() => setPrintReceipt(null)}
        />
      </main>
    </div>
  );
};
