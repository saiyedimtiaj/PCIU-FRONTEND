import {
  getCircularDepartmentOptions,
  getCirculars,
  getCircularTypeOptions,
  toCircular,
  type CircularQuery,
} from "@/lib/api/circulars";
import CircularsBrowser from "./CircularsBrowser";
import CircularsError from "./CircularsError";

export default async function CircularsResults({
  query,
}: {
  query: CircularQuery;
}) {
  const filtered = Boolean(query.type || query.departmentId);

  // Filter options come from the unfiltered list, so picking a department
  // doesn't shrink the dropdown to just that department. When nothing is
  // filtered it's the same request and Next dedupes it.
  const [result, unfiltered] = await Promise.all([
    getCirculars(query),
    filtered ? getCirculars() : null,
  ]);

  if (!result.ok) {
    return <CircularsError message={result.message} />;
  }

  const optionSource = [
    ...(unfiltered?.ok ? unfiltered.circulars : []),
    ...result.circulars,
  ];
  const departmentOptions = getCircularDepartmentOptions(optionSource);
  const activeDepartment = query.departmentId ? String(query.departmentId) : "";
  if (activeDepartment && !departmentOptions.some((o) => o.value === activeDepartment)) {
    departmentOptions.push({ value: activeDepartment, label: "Selected department" });
  }

  const now = new Date();

  return (
    <CircularsBrowser
      circulars={result.circulars.map((record, i) => toCircular(record, i, now))}
      pagination={result.pagination}
      typeOptions={getCircularTypeOptions(optionSource)}
      departmentOptions={departmentOptions}
      activeType={query.type ?? ""}
      activeDepartment={activeDepartment}
    />
  );
}
