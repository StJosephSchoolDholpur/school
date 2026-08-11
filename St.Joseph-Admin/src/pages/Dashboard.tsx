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
  fetchFeeStructure,
  saveFeeStructure,
  fetchTransportRoutes,
  saveTransportRoute,
  deleteTransportRoute,
  fetchMandatoryDocs,
  saveMandatoryDoc,
  deleteMandatoryDoc,
  fetchNews,
  saveNews,
  deleteNews,
  fetchEvents,
  saveEvent,
  deleteEvent,
  fetchBooks,
  saveBook,
  deleteBook,
  fetchAchievements,
  saveAchievement,
  deleteAchievement,
  fetchGallery,
  saveGallery,
  deleteGallery,
  fetchCalendar,
  saveCalendar,
  deleteCalendar,
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
  FeeSection,
  TransportRoute,
  MandatoryDoc,
  NewsItem,
  EventItem,
  BookItem,
  AchievementItem,
  GalleryItem,
  CalendarEvent,
  ClassEntity,
  fetchClasses,
  seedInitialClasses,
  saveClass,
  deleteClass,
  clearAllClasses
} from "../lib/db";

// Modular Sub-Components for All Pages
import { StudentManagementModule } from "../components/modules/StudentManagementModule";
import { TeacherManagementModule } from "../components/modules/TeacherManagementModule";
import { AttendanceModule } from "../components/modules/AttendanceModule";
import { ExaminationsModule } from "../components/modules/ExaminationsModule";
import { FeeCollectionsModule } from "../components/modules/FeeCollectionsModule";
import { TcPortalModule } from "../components/modules/TcPortalModule";
import { TransportModule } from "../components/modules/TransportModule";
import { OverviewModule } from "../components/modules/OverviewModule";
import { FeeStructureModule } from "../components/modules/FeeStructureModule";
import { MandatoryDocModule } from "../components/modules/MandatoryDocModule";
import { NewsModule } from "../components/modules/NewsModule";
import { EventsModule } from "../components/modules/EventsModule";
import { BooksModule } from "../components/modules/BooksModule";
import { AchievementsModule } from "../components/modules/AchievementsModule";
import { GalleryModule } from "../components/modules/GalleryModule";
import { CalendarModule } from "../components/modules/CalendarModule";
import { RbacModule } from "../components/modules/RbacModule";
import { ClassManagementModule } from "../components/modules/ClassManagementModule";
import { PrintReportCardModal, PrintFeeReceiptModal } from "../components/modules/PrintModals";

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State Stores
  const [tcs, setTcs] = useState<TCRecordData[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classList, setClassList] = useState<ClassEntity[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<FeeSection[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [mandatoryDocs, setMandatoryDocs] = useState<MandatoryDoc[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [booksList, setBooksList] = useState<BookItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
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
        fetchedClasses,
        fetchedTcs,
        fetchedTeachers,
        fetchedStudents,
        fetchedFees,
        fetchedRoutes,
        fetchedDocs,
        fetchedNews,
        fetchedEvents,
        fetchedBooks,
        fetchedAchievements,
        fetchedGallery,
        fetchedCalendar,
        fetchedAtt,
        fetchedMarks,
        fetchedReceipts
      ] = await Promise.all([
        fetchClasses(),
        fetchTCs(),
        fetchTeachers(),
        fetchStudents(),
        fetchFeeStructure(),
        fetchTransportRoutes(),
        fetchMandatoryDocs(),
        fetchNews(),
        fetchEvents(),
        fetchBooks(),
        fetchAchievements(),
        fetchGallery(),
        fetchCalendar(),
        fetchAttendance(),
        fetchExamMarks(),
        fetchFeeCollections()
      ]);

      setClassList(fetchedClasses);
      setTcs(fetchedTcs);
      setTeachers(fetchedTeachers);
      setStudents(fetchedStudents);
      setFees(fetchedFees);
      setRoutes(fetchedRoutes);
      setMandatoryDocs(fetchedDocs);
      setNews(fetchedNews);
      setEventsList(fetchedEvents);
      setBooksList(fetchedBooks);
      setAchievements(fetchedAchievements);
      setGalleryPhotos(fetchedGallery);
      setCalendarEvents(fetchedCalendar);
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

  // Handlers for Database Mutations
  const handleSaveStudent = async (s: Omit<Student, "id"> & { id?: string }) => {
    await saveStudentRecord(s);
    await loadData();
  };

  const handleDeleteStudent = async (id: string) => {
    await deleteStudentRecord(id);
    await loadData();
  };

  const handleSaveTeacher = async (t: Omit<Teacher, "id"> & { id?: string }) => {
    await saveTeacherRecord(t);
    await loadData();
  };

  const handleDeleteTeacher = async (id: string) => {
    await deleteTeacherRecord(id);
    await loadData();
  };

  const handleUploadTC = async (file: File | null, record: Omit<TCRecordData, "id" | "file_path" | "file_url" | "created_at">) => {
    await uploadAndSaveTC(file, record);
    await loadData();
  };

  const handleDeleteTC = async (id: string) => {
    await deleteTCRecord(id);
    await loadData();
  };

  const handleSaveRoute = async (r: Omit<TransportRoute, "id"> & { id?: string }) => {
    await saveTransportRoute(r);
    await loadData();
  };

  const handleDeleteRoute = async (id: string) => {
    await deleteTransportRoute(id);
    await loadData();
  };

  const handleSaveFeeStructure = async (sections: FeeSection[]) => {
    await saveFeeStructure(sections);
    await loadData();
  };

  const handleSaveDoc = async (doc: Omit<MandatoryDoc, "id"> & { id?: string }) => {
    await saveMandatoryDoc(doc);
    await loadData();
  };

  const handleDeleteDoc = async (id: string) => {
    await deleteMandatoryDoc(id);
    await loadData();
  };

  const handleSaveNews = async (n: Omit<NewsItem, "id"> & { id?: string }) => {
    await saveNews(n);
    await loadData();
  };

  const handleDeleteNews = async (id: string) => {
    await deleteNews(id);
    await loadData();
  };

  const handleSaveEvent = async (e: Omit<EventItem, "id"> & { id?: string }) => {
    await saveEvent(e);
    await loadData();
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    await loadData();
  };

  const handleSaveBook = async (b: Omit<BookItem, "id"> & { id?: string }) => {
    await saveBook(b);
    await loadData();
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    await loadData();
  };

  const handleSaveAchievement = async (a: Omit<AchievementItem, "id"> & { id?: string }) => {
    await saveAchievement(a);
    await loadData();
  };

  const handleDeleteAchievement = async (id: string) => {
    await deleteAchievement(id);
    await loadData();
  };

  const handleSavePhoto = async (p: Omit<GalleryItem, "id"> & { id?: string }) => {
    await saveGallery(p);
    await loadData();
  };

  const handleDeletePhoto = async (id: string) => {
    await deleteGallery(id);
    await loadData();
  };

  const handleSaveCalendarEvent = async (c: Omit<CalendarEvent, "id"> & { id?: string }) => {
    await saveCalendar(c);
    await loadData();
  };

  const handleDeleteCalendarEvent = async (id: string) => {
    await deleteCalendar(id);
    await loadData();
  };

  const handleSaveAttendance = async (records: AttendanceRecord[]) => {
    await saveAttendanceRecords(records);
    await loadData();
  };

  const handleSaveFeeCollection = async (record: FeeReceiptRecord) => {
    await saveFeeCollectionRecord(record);
    await loadData();
  };

  const handleSaveClass = async (c: Omit<ClassEntity, "id"> & { id?: string }) => {
    await saveClass(c);
    await loadData();
  };

  const handleDeleteClass = async (id: string) => {
    await deleteClass(id);
    await loadData();
  };

  const handleSeedClasses = async () => {
    await seedInitialClasses();
    await loadData();
  };

  const handleClearClasses = async () => {
    await clearAllClasses();
    await loadData();
  };

  const path = location.pathname;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {/* Route Module Matching */}
        {(path === "/" || path === "/dashboard") && (
          <OverviewModule
            students={students}
            teachers={teachers}
            tcs={tcs}
            routes={routes}
            onNavigateTab={(targetPath: string) => navigate(targetPath.startsWith("/") ? targetPath : `/${targetPath}`)}
          />
        )}

        {path === "/classes" && (
          <ClassManagementModule
            classList={classList}
            students={students}
            books={booksList}
            teachers={teachers}
            onSaveClass={handleSaveClass}
            onDeleteClass={handleDeleteClass}
            onSeedClasses={handleSeedClasses}
            onClearClasses={handleClearClasses}
          />
        )}

        {path === "/students" && (
          <StudentManagementModule
            students={students}
            classList={classList}
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
            classList={classList}
            onSaveAttendance={handleSaveAttendance}
          />
        )}

        {path === "/examinations" && (
          <ExaminationsModule
            students={students}
            examMarks={examMarks}
            classList={classList}
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

        {path === "/fee-structure" && (
          <FeeStructureModule
            feeStructure={fees}
            onSaveFeeStructure={handleSaveFeeStructure}
          />
        )}

        {path === "/transport" && (
          <TransportModule
            routes={routes}
            onSaveRoute={handleSaveRoute}
            onDeleteRoute={handleDeleteRoute}
          />
        )}

        {path === "/mandatory" && (
          <MandatoryDocModule
            mandatoryDocs={mandatoryDocs}
            onSaveDoc={handleSaveDoc}
            onDeleteDoc={handleDeleteDoc}
          />
        )}

        {path === "/news" && (
          <NewsModule
            newsList={news}
            onSaveNews={handleSaveNews}
            onDeleteNews={handleDeleteNews}
          />
        )}

        {path === "/events" && (
          <EventsModule
            events={eventsList}
            onSaveEvent={handleSaveEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {path === "/books" && (
          <BooksModule
            books={booksList}
            onSaveBook={handleSaveBook}
            onDeleteBook={handleDeleteBook}
          />
        )}

        {path === "/achievements" && (
          <AchievementsModule
            achievements={achievements}
            onSaveAchievement={handleSaveAchievement}
            onDeleteAchievement={handleDeleteAchievement}
          />
        )}

        {path === "/gallery" && (
          <GalleryModule
            photos={galleryPhotos}
            onSavePhoto={handleSavePhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {path === "/calendar" && (
          <CalendarModule
            events={calendarEvents}
            onSaveEvent={handleSaveCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
          />
        )}

        {path === "/rbac" && (
          <RbacModule />
        )}

        {/* Multi-Step Admission Registration Modal */}
        <StudentAdmissionModal
          isOpen={isAdmissionModalOpen}
          onClose={() => setIsAdmissionModalOpen(false)}
          classList={classList}
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
