import HeroSection from "./_ui/HeroSection";
import NoticeMarquee from "./_ui/NoticeMarquee";
import VCMessage from "./_ui/VCMessage";
import ProgramFinder from "./_ui/ProgramFinder";
import Faculties from "./_ui/Faculties";
import Admissions from "./_ui/Admissions";
import Research from "./_ui/Research";
import PhotoGallery from "./_ui/PhotoGallery";
import CampusLife from "./_ui/CampusLife";
import NewsEvents from "./_ui/NewsEvents";

export default function Page() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-highlight text-highlight-foreground px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>
      <main id="main-content">
        <HeroSection />
        <NoticeMarquee />
        <VCMessage />
        <ProgramFinder />
        <Faculties />
        <Admissions />
        <Research />
        <PhotoGallery />
        <CampusLife />
        <NewsEvents />
      </main>
    </>
  );
}
