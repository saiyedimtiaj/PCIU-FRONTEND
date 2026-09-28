import type { FacultyOverview } from "@/types/faculty-overview";

/**
 * TODO(API): This is placeholder data — the faculty-overview backend endpoint
 * doesn't exist yet. Once it does, replace the body of getFacultyOverview()
 * with a real fetch (mirroring getFaculties()/getStats() in lib/api/home.ts —
 * same API_BASE_URL pattern, error handling, and revalidate strategy).
 * Keep the function's name, signature, and return shape unchanged so no
 * caller (app/faculties/page.tsx) needs to change when this swap happens.
 */

const DUMMY_FACULTIES: FacultyOverview[] = [
  {
    id: 1,
    slug: "engineering",
    icon: "graduation-cap",
    name: "Faculty of Science & Engineering",
    shortName: "Science & Engineering",
    dean: "Prof. Dr. Engr. Mafzal Ahmed",
    about:
      "The Faculty of Science & Engineering at Port City International University is committed to producing skilled engineers and technologists who can meet the demands of a rapidly evolving global landscape. With state-of-the-art laboratories, experienced faculty, and industry partnerships, students receive a comprehensive education that blends theoretical knowledge with practical application.",
    vision:
      "To be a leading center of excellence in engineering and technology education, producing innovative professionals who contribute to national and global development.",
    mission:
      "To provide quality education in science and engineering disciplines, foster research and innovation, and prepare graduates for successful careers in industry and academia.",
    departments: [
      {
        name: "Computer Science & Engineering (CSE)",
        chairman: "Mrs. Manoara Begum",
        programs: ["B.Sc. in CSE"],
      },
      {
        name: "Electrical & Electronic Engineering (EEE)",
        chairman: "Mr. Deepak Kumar Chowdhury",
        programs: ["B.Sc. in EEE"],
      },
      {
        name: "Civil Engineering",
        chairman: "Dr. Engr. Ajoy Paul",
        programs: ["B.Sc. in Civil Engineering"],
      },
      {
        name: "Textile Engineering",
        chairman: "Engr. Mr. Iusuf Khan",
        programs: ["B.Sc. in Textile Engineering"],
      },
      {
        name: "Fashion Design & Technology",
        chairman: "Mr. Ashraful Islam",
        programs: ["B.Sc. in Fashion Design & Technology"],
      },
    ],
    highlights: [
      "Modern computer and electronics labs",
      "Industry-linked curriculum",
      "Research opportunities in emerging technologies",
      "Experienced and dedicated faculty members",
    ],
  },
  {
    id: 2,
    slug: "business",
    icon: "building",
    name: "Faculty of Business Studies",
    shortName: "Business Studies",
    dean: "Prof. Dr. Md. Fashiul Alam",
    about:
      "The Faculty of Business Studies prepares future business leaders with a strong foundation in management, finance, marketing, and accounting. Our programs emphasize ethical leadership, strategic thinking, and practical business skills to meet the challenges of the global marketplace.",
    vision:
      "To develop globally competitive business graduates who drive economic growth with integrity and innovation.",
    mission:
      "To deliver world-class business education, cultivate entrepreneurial thinking, and build leaders who create value for organizations and society.",
    departments: [
      {
        name: "Business Administration (BBA)",
        chairman: "Md. Musa",
        programs: ["BBA", "MBA"],
      },
    ],
    highlights: [
      "Case-study based learning approach",
      "Industry internship programs",
      "Entrepreneurship development initiatives",
      "Experienced faculty with industry backgrounds",
    ],
  },
  {
    id: 3,
    slug: "humanities",
    icon: "book-open",
    name: "Faculty of Humanities, Social Science & Law",
    shortName: "Humanities, Social Science & Law",
    dean: "Prof. Mainul Hasan Chowdhury",
    about:
      "The Faculty of Humanities, Social Science & Law nurtures critical thinkers and socially conscious professionals. Through programs in English, Journalism, and Law, students develop strong analytical, communication, and advocacy skills that are essential for careers in media, law, public service, and academia.",
    vision:
      "To foster intellectual growth, social responsibility, and legal excellence, producing graduates who contribute to a just and informed society.",
    mission:
      "To provide comprehensive education in the humanities, social sciences, and legal studies, promoting critical inquiry, ethical leadership, and community engagement.",
    departments: [
      {
        name: "English",
        chairman: "Mr. A S M Iftekarul Azan",
        programs: ["BA (Hons) in English", "MA in English"],
      },
      {
        name: "Journalism & Media Studies",
        programs: ["BA (Hons) in Journalism"],
      },
      { name: "Law", programs: ["LLB (Hons)", "LLM"] },
    ],
    highlights: [
      "Moot court and legal aid clinics",
      "Media lab and journalism workshops",
      "Community engagement programs",
      "Distinguished visiting faculty",
    ],
  },
];

export async function getFacultyOverview(): Promise<FacultyOverview[]> {
  return DUMMY_FACULTIES;
}
