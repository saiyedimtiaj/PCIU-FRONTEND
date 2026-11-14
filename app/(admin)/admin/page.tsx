import type { Metadata } from "next";
import dashboardData from "@/content/admin/dashboard.json";
import type { AdminDashboardContent } from "@/types/admin-dashboard";
import AdminDashboardOverview from "./_ui/AdminDashboardOverview";

export const metadata: Metadata = {
  title: "Admin Dashboard | Port City International University",
};

const data = dashboardData as AdminDashboardContent;

export default function AdminDashboardPage() {
  return <AdminDashboardOverview data={data} />;
}
