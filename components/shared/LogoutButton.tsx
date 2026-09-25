"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-1 hover:text-accent transition-colors font-medium cursor-pointer disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      <span>{isPending ? "Logging out..." : "Logout"}</span>
    </button>
  );
}
