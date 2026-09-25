import { Shield, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { getSession, logoutAction } from "@/app/(auth)/actions";

const Topbar = async () => {
  const session = await getSession();

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
            {session ? (
              <>
                <Link
                  href={session.role === "admin" ? "/admin" : "/faculty-portal"}
                  className="flex items-center gap-1 hover:text-accent transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={() => logoutAction()}
                  className="flex items-center gap-1 hover:text-accent transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="flex items-center gap-1 hover:text-accent transition-colors font-medium"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
