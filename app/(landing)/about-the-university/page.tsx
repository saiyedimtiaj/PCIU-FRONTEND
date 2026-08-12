import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AboutHero from "./_ui/AboutHero";
import MainContent from "./_ui/MainContent";
import VisionMissionValues from "./_ui/VisionMissionValues";
import CampusBanner from "./_ui/CampusBanner";

export const metadata: Metadata = {
  title: "About the University | Port City International University",
  description:
    "Shaping future leaders through excellence in education, research, and global engagement at Port City International University (PCIU), Chattogram.",
};

export default function AboutUniversityPage() {
  return (
    <div className="min-h-screen bg-background">
      <AboutHero />
      <Breadcrumb items={[{ label: "About the University" }]} />
      <MainContent />
      <VisionMissionValues />
      <CampusBanner />
    </div>
  );
}
