"use client";

import Link from "next/link";
import { Shield, LayoutDashboard } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { useNavSession } from "./use-nav-session";

export default function TopbarAuth() {
  const session = useNavSession();

  // Hold the slot while checking, so the bar doesn't flash "Admin Login"
  // at a signed-in admin.
  if (session === undefined) return <span className="h-5 w-24" aria-hidden="true" />;

  return session ? (
    <>
      <Link
        href={session.role === "admin" ? "/admin" : "/faculty-portal"}
        className="flex items-center gap-1 hover:text-accent transition-colors font-medium"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      <LogoutButton />
    </>
  ) : (
    <Link
      href="/signin"
      className="flex items-center gap-1 hover:text-accent transition-colors font-medium"
    >
      <Shield className="w-4 h-4" />
      <span>Admin Login</span>
    </Link>
  );
}
