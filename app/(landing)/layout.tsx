import React from "react";
import Footer from "@/components/shared/footer";
import Topbar from "@/components/shared/Topbar";
import Navbar from "@/components/shared/Navbar";
import PopupContainer from "@/components/popup/PopupContainer";
import { getActivePopups } from "@/lib/api/popup";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const popups = await getActivePopups();

  return (
    <div>
      <Topbar />
      <Navbar />
      {children}
      <PopupContainer popups={popups} />
      <Footer />
    </div>
  );
};

export default layout;
