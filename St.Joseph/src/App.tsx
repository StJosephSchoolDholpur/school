import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import DirectorMessage from "./pages/DirectorMessage";
import PrincipalMessage from "./pages/PrincipalMessage";
import VisionMission from "./pages/VisionMission";
import Faculty from "./pages/Faculty";
import Academics from "./pages/Academics";
import Admissions from "./pages/Admissions";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Infrastructure from "./pages/Infrastructure";
import Curriculum from "./pages/Curriculum";
import Books from "./pages/Books";
import TCVerification from "./pages/TCVerification";
import Achievements from "./pages/Achievements";
import Sports from "./pages/Sports";
import CoCurricular from "./pages/CoCurricular";
import Transportation from "./pages/Transportation";
import FeeStructure from "./pages/FeeStructure";
import SchoolCalendar from "./pages/SchoolCalendar";
import StudentLife from "./pages/StudentLife";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import MandatoryPublicDisclosure from "./pages/MandatoryPublicDisclosure";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
       <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/principal-message" element={<PrincipalMessage />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/mandatory-public-disclosure"  element={<MandatoryPublicDisclosure />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/books" element={<Books />} />
          <Route path="/tc" element={<TCVerification />} />
          <Route path="/transfer-certificate" element={<TCVerification />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/co-curricular" element={<CoCurricular />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/fee-structure" element={<FeeStructure />} />
          <Route path="/calendar" element={<SchoolCalendar />} />
          <Route path="/student-life" element={<StudentLife />} />
          <Route path="/director-message" element={<DirectorMessage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;