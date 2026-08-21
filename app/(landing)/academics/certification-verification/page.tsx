import SectionShell from "@/components/shared/SectionShell";
import CertificationVerificationSection from "../_ui/CertificationVerificationSection";
import { NAV_ITEMS } from "../layout";

export default function CertificationVerificationPage() {
  return (
    <SectionShell
      title="Academic Menu"
      items={NAV_ITEMS}
      activeId="certification-verification"
      basePath="/academics"
      routingMode="path"
    >
      <CertificationVerificationSection />
    </SectionShell>
  );
}
