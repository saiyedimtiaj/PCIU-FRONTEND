import FacultyDashboard from "@/components/faculty/FacultyDashboard";

export default async function FacultyWorkspaceOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="w-full p-6">
      <FacultyDashboard basePath={`/admin/faculty/${id}`} publicProfileHref={`/faculty/${id}`} />
    </div>
  );
}
