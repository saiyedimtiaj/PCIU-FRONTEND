import Link from "next/link";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import TopbarAuth from "./TopbarAuth";

const Topbar = () => {
  return (
    <div className="hidden lg:block bg-primary text-primary-foreground py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link
              href="https://www.facebook.com/PortCityIntUniversity#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              <FaFacebook className="text-base" />
            </Link>
            <Link
              href="https://www.youtube.com/@portcityinternationalunive2828/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              <FaYoutube className="text-base" />
            </Link>
            <Link
              href="https://www.linkedin.com/school/port-city-international-university-bangladesh/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              <FaLinkedin className="text-base" />
            </Link>
            <Link
              href="https://www.instagram.com/portcityintuniversity/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              <FaInstagram className="text-base" />
            </Link>
          </div>
          <Link
            href="https://studentportal.portcity.edu.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            Student Portal
          </Link>
          <div className="flex items-center gap-4">
            <TopbarAuth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
