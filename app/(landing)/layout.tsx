import React from "react";
import Footer from "@/components/shared/footer";
import Topbar from "@/components/shared/Topbar";
import Navbar from "@/components/shared/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Topbar />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
