import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
