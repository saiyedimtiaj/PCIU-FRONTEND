"use server";

import { publicFetch } from "@/lib/server-fetch";
import { getFaculties } from "@/lib/api/home";
import type { FacultyItem } from "@/types/home";

export interface ProgramFinderItem {
  id: number;
  title: string;
  duration: string | number;
  programType: string;
  icon: string | null;
  departmentName: string;
  departmentSubtitle: string | null;
  departmentSlug: string;
  facultyName: string;
}

interface HomeProgram {
  id: number;
  departmentId: number;
  icon?: string | null;
  title: string;
  duration: string | number;
  programType: string;
  status: boolean;
  deletedAt?: string | null;
  department?: { slug?: string | null } | null;
}

interface DepartmentDirectoryItem {
  id: number;
  slug: string;
}

interface DepartmentDetails {
  id: number;
  name: string;
  slug: string;
  subtitle: string | null;
  faculty?: { name: string } | null;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

async function getData<T>(path: string): Promise<T> {
  const response = await publicFetch.get(path, {
    next: { revalidate: 300, tags: ["program-finder", path] },
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false || payload.data === undefined) {
    throw new Error(`Request failed: ${path}`);
  }

  return payload.data;
}

export async function getProgramFinderData(): Promise<{
  programs: ProgramFinderItem[];
  error: boolean;
}> {
  try {
    const [apiPrograms, facultyDirectory] = await Promise.all([
      getData<HomeProgram[]>("/home/programs"),
      getFaculties(),
    ]);
    const departmentDirectory = new Map<number, DepartmentDirectoryItem>();

    facultyDirectory.forEach((faculty: FacultyItem) => {
      faculty.departments?.forEach((department) => {
        departmentDirectory.set(department.id, department);
      });
    });

    const activePrograms = apiPrograms.filter(
      (program) => program.status === true && program.deletedAt == null,
    );
    const uniqueDepartments = new Map<number, Promise<DepartmentDetails>>();

    activePrograms.forEach((program) => {
      const directoryDepartment = departmentDirectory.get(program.departmentId);
      const slug = program.department?.slug || directoryDepartment?.slug;
      if (!slug || uniqueDepartments.has(program.departmentId)) return;

      uniqueDepartments.set(
        program.departmentId,
        getData<DepartmentDetails>(`/department/${encodeURIComponent(slug)}`),
      );
    });

    const departmentResults = await Promise.all(
      [...uniqueDepartments.entries()].map(async ([id, request]) => {
        try {
          return [id, await request] as const;
        } catch {
          return null;
        }
      }),
    );
    const departmentDetails = new Map(
      departmentResults.filter(
        (result): result is readonly [number, DepartmentDetails] =>
          result !== null,
      ),
    );

    return {
      programs: activePrograms.flatMap((program) => {
        const department = departmentDetails.get(program.departmentId);
        if (!department || department.id !== program.departmentId) return [];

        return [
          {
            id: program.id,
            title: program.title,
            duration: program.duration,
            programType: program.programType,
            icon: program.icon || null,
            departmentName: department.name,
            departmentSubtitle: department.subtitle,
            departmentSlug: department.slug,
            facultyName: department.faculty?.name || "",
          },
        ];
      }),
      error: false,
    };
  } catch {
    return { programs: [], error: true };
  }
}
