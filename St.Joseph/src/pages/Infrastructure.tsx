import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import schoolBuilding from "@/assets/school-building.png";
import { Building2, FlaskConical, BookOpen, Monitor, Dumbbell, Music } from "lucide-react";
import Lab from "@/assets/Lab.png";
import smartclassroom from "@/assets/SmartClassroom.jpg";
const facilities = [
  {
    title: "Smart Classrooms",
    image:
      smartclassroom,
    desc: "Our smart classrooms are equipped with interactive digital boards, projectors, and modern teaching tools to make learning engaging and effective for every student.",
  },
  {
    title: "Science Laboratory",
    image:
      Lab,
    desc: "Well-equipped physics, chemistry, and biology labs provide hands-on practical experience and encourage scientific thinking among students.",
  },
  {
    title: "Computer Lab",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    desc: "Our advanced computer lab offers high-speed internet and the latest systems to help students build strong digital and technical skills.",
  },
  {
    title: "Library",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
    desc: "The school library provides a peaceful learning environment with a wide collection of books, journals, and digital resources for students.",
  },
];

const Infrastructure = () => (
  <Layout>
    <PageHero title="Infrastructure" subtitle="World-class facilities for holistic learning" breadcrumb="Infrastructure" />
    <section className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection>
          <div className="rounded-2xl overflow-hidden mb-16 shadow-xl">
            <img src={schoolBuilding} alt="School Building" className="w-full h-64 md:h-96 object-cover" />
          </div>
        </AnimatedSection>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {facilities.map((f, i) => (
    <div
      key={i}
      className="card bg-base-100 shadow-xl hover:-translate-y-2 transition-all duration-300"
    >
      <figure className="h-56 overflow-hidden">
        <img
          src={f.image}
          alt={f.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </figure>

      <div className="card-body p-2">
        <h2 className="card-title text-primary">
          {f.title}
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          {f.desc}
        </p>

        <div className="card-actions justify-end mt-4">
          {/* <button className="btn btn-primary btn-sm rounded-full">
            Explore
          </button> */}
        </div>
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
  </Layout>
);

export default Infrastructure;