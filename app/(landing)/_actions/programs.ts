"use server";

import { publicFetch } from "@/lib/server-fetch";
import { getFaculties } from "@/lib/api/home";
import type { FacultyItem } from "@/types/home";
import type { ProgramDetail } from "@/types/department";

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
  department?: {
    slug?: string | null;
  } | null;
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
  faculty?: {
    name: string;
  } | null;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

async function getData<T>(path: string): Promise<T> {
  const response = await publicFetch.get(path, {
    next: {
      revalidate: 300,
      tags: ["program-finder", path],
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");

    console.error(
      `[ProgramFinder] Request failed: ${response.status} ${path}`,
      errorText,
    );

    throw new Error(`Request failed: ${path} (${response.status})`);
  }

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    console.error(`[ProgramFinder] Invalid JSON response: ${path}`);
    throw new Error(`Invalid JSON response: ${path}`);
  }

  if (payload.success === false || payload.data === undefined) {
    throw new Error(`Invalid API response: ${path}`);
  }

  return payload.data;
}

export async function getProgramFinderData(): Promise<{
  programs: ProgramFinderItem[];
  error: boolean;
}> {
  try {
    // 1. Get programs first
    const apiPrograms = await getData<HomeProgram[]>("/home/programs");

    const activePrograms = apiPrograms.filter(
      (program) => program.status === true && program.deletedAt == null,
    );

    // 2. Build department directory only when a program
    //    does not already provide its department slug.
    const departmentDirectory = new Map<number, DepartmentDirectoryItem>();

    const programsWithoutSlug = activePrograms.filter(
      (program) =>
        !program.department?.slug &&
        !departmentDirectory.has(program.departmentId),
    );

    // 3. Only call faculties API if it is actually needed.
    if (programsWithoutSlug.length > 0) {
      try {
        const facultyDirectory = await getFaculties();

        facultyDirectory.forEach((faculty: FacultyItem) => {
          faculty.departments?.forEach((department) => {
            departmentDirectory.set(department.id, department);
          });
        });
      } catch (error) {
        console.error(
          "[ProgramFinder] Failed to load faculty directory:",
          error,
        );
      }
    }

    // 4. Create unique department requests.
    const uniqueDepartments = new Map<number, Promise<DepartmentDetails>>();

    activePrograms.forEach((program) => {
      const directoryDepartment = departmentDirectory.get(program.departmentId);

      const slug = program.department?.slug || directoryDepartment?.slug;

      if (!slug || uniqueDepartments.has(program.departmentId)) {
        return;
      }

      uniqueDepartments.set(
        program.departmentId,
        getData<DepartmentDetails>(`/department/${encodeURIComponent(slug)}`),
      );
    });

    // 5. Fetch department details.
    const departmentResults = await Promise.all(
      [...uniqueDepartments.entries()].map(async ([id, request]) => {
        try {
          return [id, await request] as const;
        } catch (error) {
          console.error(
            `[ProgramFinder] Failed to load department ${id}:`,
            error,
          );

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

    // 6. Build final ProgramFinder data.
    const programs = activePrograms.flatMap((program) => {
      const department = departmentDetails.get(program.departmentId);

      if (!department || department.id !== program.departmentId) {
        return [];
      }

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
    });

    return {
      programs,
      error: false,
    };
  } catch (error) {
    console.error("[ProgramFinder] Failed to load program finder data:", error);

    return {
      programs: [],
      error: true,
    };
  }
}

export async function getProgramDetails(id: string): Promise<ProgramDetail | null> {
  try {
    const res = await publicFetch.get(`/programs/${id}`, {
      next: { tags: ["programs", `program-${id}`] }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data as ProgramDetail;
  } catch {
    return null;
  }
}
