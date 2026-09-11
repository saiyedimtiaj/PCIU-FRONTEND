import { Globe, Search, Shield } from "lucide-react";
import Link from "next/link";

const Topbar = () => {
  return (
    <div className="hidden lg:block bg-primary text-primary-foreground py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link
              href="#prospective"
              className="hover:text-accent transition-colors"
            >
              Prospective Students
            </Link>
            <Link
              href="#current"
              className="hover:text-accent transition-colors"
            >
              Current Students
            </Link>
            <Link
              href="/faculty"
              className="hover:text-accent transition-colors"
            >
              Faculty &amp; Staff
            </Link>
            <Link
              href="#alumni"
              className="hover:text-accent transition-colors"
            >
              Alumni
            </Link>
            <Link
              href="/signin"
              className="hover:text-accent transition-colors font-medium"
            >
              Faculty Portal
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="flex items-center gap-1 hover:text-accent transition-colors font-medium"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
