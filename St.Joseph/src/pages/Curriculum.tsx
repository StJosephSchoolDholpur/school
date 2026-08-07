// import Layout from "@/components/Layout";
// import PageHero from "@/components/PageHero";
// import AnimatedSection from "@/components/AnimatedSection";
// import { CheckCircle } from "lucide-react";

// const curriculumData = [
  
//   {
//   level: "Primary",
//   classes: "Classes I – V",
  
//   subjects: [
//     "English",
//     "Hindi",
//     "Mathematics",
//     "EVS / Science",
//     "Social Studies",
//     "Computer",
//     "Art",
//     "Music"
//   ],

//   approach: "Experiential learning with emphasis on reading, writing, speaking, and basic analytical skills using activity-based methods.",

//   curriculum: {
    
//     English: {
//       focus: "Reading, writing, phonics, vocabulary, and basic grammar.",
//       topics: [
//         "Alphabet & phonics",
//         "Simple words & sentence formation",
//         "Reading comprehension (short stories)",
//         "Basic grammar (nouns, verbs, adjectives)",
//         "Paragraph writing & storytelling"
//       ]
//     },

//     Hindi: {
//       focus: "भाषा ज्ञान, पठन, लेखन और व्याकरण की नींव",
//       topics: [
//         "वर्णमाला और शब्द निर्माण",
//         "सरल वाक्य लेखन",
//         "कहानी और कविता पढ़ना",
//         "व्याकरण (संज्ञा, क्रिया)",
//         "अनुच्छेद लेखन"
//       ]
//     },

//     Mathematics: {
//       focus: "Basic numerical skills and logical thinking",
//       topics: [
//         "Numbers (1–1000+)",
//         "Addition, subtraction, multiplication, division",
//         "Tables (2–10/12)",
//         "Shapes & patterns",
//         "Measurement (length, weight, time)",
//         "Basic data handling"
//       ]
//     },

//     "EVS / Science": {
//       focus: "Understanding surroundings and basic science concepts",
//       topics: [
//         "Myself & family",
//         "Plants & animals",
//         "Food & health",
//         "Water, air, environment",
//         "Basic science (light, force – intro level)"
//       ]
//     },

//     "Social Studies": {
//       focus: "Basic understanding of society and environment",
//       topics: [
//         "Neighborhood & community",
//         "Transport & communication",
//         "Maps (basic)",
//         "Culture & festivals",
//         "Good habits & civic sense"
//       ]
//     },

//     Computer: {
//       focus: "Introduction to digital literacy",
//       topics: [
//         "Basics of computer",
//         "Parts of computer",
//         "Using keyboard & mouse",
//         "Drawing tools (Paint)",
//         "Introduction to typing"
//       ]
//     },

//     Art: {
//       focus: "Creativity and imagination",
//       topics: [
//         "Drawing & coloring",
//         "Craft work",
//         "Paper activities",
//         "Clay modeling"
//       ]
//     },

//     Music: {
//       focus: "Basic rhythm and singing skills",
//       topics: [
//         "Rhymes & songs",
//         "Basic musical notes",
//         "Group singing",
//         "Clapping patterns & rhythm"
//       ]
//     }
//   },

//   assessment: {
//     type: "Continuous and Comprehensive Evaluation (CCE)",
//     methods: [
//       "Worksheets",
//       "Oral tests",
//       "Class activities",
//       "Projects",
//       "Observation-based assessment"
//     ]
//   }
// }

// ];
// // {
// //     level: "Middle School",
// //     classes: "Classes VI – VIII",
// //     subjects: ["English", "Hindi", "Sanskrit", "Mathematics", "Science", "Social Science", "Computer Science", "Art", ],
// //     approach: "Inquiry-based learning with project work and practical assessments.",
// //   },
// //   {
// //     level: "Secondary",
// //     classes: "Classes IX – X",
// //     subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "IT / Computer"],
// //     approach: "Board exam preparation with conceptual understanding and application-based learning.",
// //   },
// const Curriculum = () => (
//   <Layout>
//     <PageHero title="Curriculum" subtitle="CBSE-aligned comprehensive curriculum" breadcrumb="Curriculum" />
//     <section className="section-padding">
//       <div className="container mx-auto max-w-5xl">
//         <div className="space-y-8">
//           {curriculumData.map((c, i) => (
//             <AnimatedSection key={c.level} delay={i * 0.1}>
//               <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
//                 <div className="bg-primary p-4 px-6">
//                   <h3 className="font-heading font-bold text-xl text-primary-foreground">{c.level}</h3>
//                   <p className="text-primary-foreground/70 text-sm">{c.classes}</p>
//                 </div>
//                 <div className="p-6">
//                   <p className="text-muted-foreground mb-4 italic">{c.approach}</p>
//                   <div className="grid sm:grid-cols-2 gap-2">
//                     {c.subjects.map((s) => (
//                       <div key={s} className="flex items-center gap-2 text-sm text-foreground">
//                         <CheckCircle className="w-4 h-4 text-secondary shrink-0" /> {s}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </AnimatedSection>
//           ))}
//         </div>
//       </div>
//     </section>
//   </Layout>
// );

// export default Curriculum;


import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { CheckCircle } from "lucide-react";

// ✅ Curriculum Data (Primary example)
const curriculumData = [
  {
    level: "Primary",
    classes: "Classes I – V",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "EVS / Science",
      "Social Studies",
      "Computer",
      "Art",
      "Music",
    ],
    approach:
      "Experiential learning with emphasis on reading, writing, speaking, and analytical skills using activity-based methods.",
  },

  {
  level: "Middle School",
  classes: "Classes VI – VIII",

  subjects: [
    "English",
    "Hindi",
    "Sanskrit",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer Science",
    "Art"
  ],

  approach:
    "Inquiry-based learning with focus on concept building, critical thinking, project work, and practical assessments.",

  curriculum: {

    English: {
      focus: "Reading comprehension, grammar, writing, and communication skills",
      topics: [
        "Prose & poetry",
        "Grammar (tenses, active/passive voice)",
        "Letter & paragraph writing",
        "Story writing",
        "Comprehension passages"
      ]
    },

    Hindi: {
      focus: "भाषा कौशल, व्याकरण और साहित्य की समझ",
      topics: [
        "गद्य और पद्य",
        "व्याकरण (काल, वाक्य रचना)",
        "पत्र और अनुच्छेद लेखन",
        "कहानी लेखन",
        "अपठित गद्यांश"
      ]
    },

    Sanskrit: {
      focus: "Basic understanding of Sanskrit language",
      topics: [
        "शब्द रूप और धातु रूप",
        "सरल वाक्य निर्माण",
        "अनुवाद (Hindi ↔ Sanskrit)",
        "छोटे श्लोक"
      ]
    },

    Mathematics: {
      focus: "Conceptual clarity and problem-solving skills",
      topics: [
        "Fractions & decimals",
        "Integers",
        "Algebra (basic expressions & equations)",
        "Geometry (lines, angles, triangles)",
        "Mensuration",
        "Data handling"
      ]
    },

    Science: {
      focus: "Understanding scientific concepts with experiments",
      topics: [
        "Physics (motion, force – basics)",
        "Chemistry (elements, mixtures)",
        "Biology (plants, human body)",
        "Lab activities & experiments"
      ]
    },

    "Social Science": {
      focus: "Understanding society, history, and geography",
      topics: [
        "History (ancient to medieval)",
        "Geography (earth, resources)",
        "Civics (government, rights)",
        "Map work"
      ]
    },

    "Computer Science": {
      focus: "Digital literacy and basic programming",
      topics: [
        "Computer fundamentals",
        "MS Office (Word, PowerPoint)",
        "Internet basics",
        "Introduction to coding (Scratch / basics)",
        "Typing skills"
      ]
    },

    Art: {
      focus: "Creativity and artistic skills",
      topics: [
        "Drawing & painting",
        "Craft work",
        "Design patterns",
        "Creative projects"
      ]
    }
  },

  assessment: {
    type: "Continuous and Comprehensive Evaluation (CCE)",
    methods: [
      "Written tests",
      "Projects",
      "Practical work",
      "Oral assessments",
      "Class participation"
    ]
  }
},


{
  level: "Secondary",
  classes: "Classes IX – X",

  subjects: [
    "English",
    "Hindi",
    "Mathematics",
    "Science",
    "Social Science",
    "IT / Computer"
  ],

  approach:
    "Board exam preparation with strong conceptual understanding, application-based learning, and regular practice through tests and assessments.",

  curriculum: {

    English: {
      focus: "Advanced reading, writing, grammar, and literature analysis",
      topics: [
        "Prose & poetry (NCERT)",
        "Grammar (tenses, modals, voice)",
        "Letter writing (formal/informal)",
        "Article & report writing",
        "Reading comprehension"
      ]
    },

    Hindi: {
      focus: "साहित्य, व्याकरण और लेखन कौशल",
      topics: [
        "गद्य और पद्य",
        "व्याकरण (वाक्य, अलंकार)",
        "पत्र और अनुच्छेद लेखन",
        "अपठित गद्यांश",
        "लेखन कौशल"
      ]
    },

    Mathematics: {
      focus: "Problem-solving and analytical thinking",
      topics: [
        "Algebra (polynomials, linear equations)",
        "Trigonometry",
        "Geometry (triangles, circles)",
        "Mensuration",
        "Statistics & Probability"
      ]
    },

    Science: {
      focus: "Conceptual clarity with practical applications",
      topics: [
        "Physics (motion, electricity, light)",
        "Chemistry (reactions, acids & bases, carbon)",
        "Biology (life processes, control & coordination, environment)",
        "Lab experiments"
      ]
    },

    "Social Science": {
      focus: "Understanding society, economy, and governance",
      topics: [
        "History (nationalism, freedom struggle)",
        "Geography (resources, climate, agriculture)",
        "Civics (democracy, rights, government)",
        "Economics (development, money, globalization)"
      ]
    },

    "IT / Computer": {
      focus: "Digital skills and basic programming knowledge",
      topics: [
        "Computer fundamentals",
        "MS Office / productivity tools",
        "Internet & cybersecurity basics",
        "Introduction to programming (Python / basics)",
        "Practical lab work"
      ]
    }
  },

  assessment: {
    type: "CBSE Board + Internal Assessment",
    methods: [
      "Periodic tests",
      "Pre-board exams",
      "Board examination (Class X)",
      "Practical exams",
      "Assignments & projects"
    ]
  }
}
];

export default function CurriculumPage() {
  return (
    <Layout>
      <PageHero
        title="Curriculum"
        subtitle="CBSE-aligned comprehensive curriculum"
        breadcrumb="Curriculum"
      />

      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8">

            {curriculumData?.map((c, i) => (
              <AnimatedSection key={c.level || i} delay={i * 0.1}>
                
                <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
                  
                  {/* Header */}
                  <div className="bg-primary p-4 px-6">
                    <h3 className="font-heading font-bold text-xl text-primary-foreground">
                      {c.level}
                    </h3>
                    <p className="text-primary-foreground/70 text-sm">
                      {c.classes}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4 italic">
                      {c.approach}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {c.subjects?.map((s, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </AnimatedSection>
            ))}

          </div>
        </div>
      </section>
    </Layout>
  );
}