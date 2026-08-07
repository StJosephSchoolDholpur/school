// import { motion, AnimatePresence } from "framer-motion";

// import { createPortal } from "react-dom";
// import { X } from "lucide-react";
// import Enrollnow from "../assets/Enrollnow.jpeg";

// const AdmissionPopup = ({ open, onClose }) => {
//   if (typeof document === "undefined") return null;

//   return createPortal(
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
//         >
//           {/* Card */}
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             transition={{ duration: 0.35 }}
//             className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
//           >
//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Image Container */}
// <div className="w-full h-full flex items-center justify-center bg-black">
//   <img
//     src={Enrollnow}
//     alt="Admission Open Poster"
//     onClick={() => {
//         navigate("/admissions");
//       onClose();
//     }}
//     className="w-full h-full object-contain cursor-pointer hover:scale-[1.01] transition-transform duration-300"
//   />
// </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>,
//     document.body
//   );
// };

// export default AdmissionPopup;


import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X, GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Enrollnow from "../assets/Enrollnow.jpeg";

const AdmissionPopup = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          {/* Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            {/* IMAGE BACKGROUND */}
            <div className="relative w-full h-full">
              <img
                src={Enrollnow}
                alt="Admission Open Poster"
                className="w-full h-full object-cover"
              />

              {/* DARK OVERLAY FOR PREMIUM LOOK */}
              <div className="absolute inset-0 bg-black/30" />

              {/* FLOATING CONTENT ON IMAGE */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

                {/* Badge */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-4">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-bold uppercase text-sm tracking-widest">
                    Admission
                  </span>
                  <span className="text-white font-semibold uppercase text-sm">
                    Open
                  </span>
                </div>

                {/* Year */}
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                  2026 - 2027
                </h2>

                {/* CTA */}
                <button
                  onClick={() => {
                    onClose();
                    navigate("/admissions");
                  }}
                  className="mt-4 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                >
                  Enroll Now
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AdmissionPopup;