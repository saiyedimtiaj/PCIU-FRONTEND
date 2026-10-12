import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getAboutUniversity } from "@/lib/api/about";
import AboutHero from "./_ui/AboutHero";
import MainContent from "./_ui/MainContent";
import VisionMissionValues from "./_ui/VisionMissionValues";
import CampusBanner from "./_ui/CampusBanner";

export const metadata: Metadata = {
  title: "About the University | Port City International University",
  description:
    "Shaping future leaders through excellence in education, research, and global engagement at Port City International University (PCIU), Chattogram.",
};

export default async function AboutUniversityPage() {
  const about = await getAboutUniversity();

  return (
    <div className="min-h-screen bg-background">
      <AboutHero about={about} />
      <div className="container mx-auto px-4 pt-6 sm:pt-8">
        <Breadcrumb items={[{ label: "About the University" }]} className="mx-auto max-w-6xl" />
      </div>
      <MainContent about={about} />
      <VisionMissionValues about={about} />
      <CampusBanner about={about} />
    </div>
  );
}
