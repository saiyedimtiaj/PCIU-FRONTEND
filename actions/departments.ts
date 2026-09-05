"use server";

import { publicFetch } from "@/lib/server-fetch";
import type {
  ApiDepartmentResponse,
  DepartmentContent,
} from "@/types/department";

export async function getDepartmentBySlug(
  slug: string,
): Promise<DepartmentContent | null> {
  try {
    const res = await publicFetch.get(`/department/${slug}`, {
      next: { tags: ["department", slug] },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return mapApiDepartmentToContent(data.data);
      }
    }
  } catch (error) {
    console.error(
      `[Actions: getDepartmentBySlug] Failed to fetch department ${slug}:`,
      error,
    );
  }

  return null;
}

function mapApiDepartmentToContent(
  apiData: ApiDepartmentResponse,
): DepartmentContent {
  return {
    slug: apiData.slug,
    chairmanHeading: "Message from the Chairman",
    facilitiesHeading: "Department Facilities",
    hero: {
      badge: apiData.shortName,
      title: apiData.name,
      subtitle: apiData.subtitle,
    },
    stats: [
      { label: "Graduates", value: apiData.graduate.toString() },
      { label: "Current Students", value: apiData.currentStudent.toString() },
    ],
    chairman: apiData.chairman
      ? {
          name: apiData.chairman.name,
          designation: apiData.chairman.designation,
          message: apiData.chairman.message || [],
        }
      : {
          name: "Chairman Name",
          designation: "Head of Department",
          message: ["Welcome to our department."],
        },
    overview: {
      content: [apiData.description],
      hasImage: !!apiData.image,
    },
    facilities: [], // Empty state
    programs: [], // Empty state
    notices: [], // Empty state
    contact: {
      address: apiData.officeLocation,
      phone: apiData.phone,
      email: apiData.email,
      hours: "Sunday - Thursday: 9:00 AM - 5:00 PM",
    },
    quickLinks: (apiData.quickLink || []).map((link) => ({
      label: link,
      url: "#",
    })),
    facultyMembers: [], // Empty state
    researchAreas: [], // Empty state
    industryPartners: [], // Empty state
    achievements: [
      {
        label: "Research Papers",
        value: (apiData.numberOfResearch || 0).toString(),
      },
      {
        label: "Industry Partners",
        value: (apiData.numberOfPartner || 0).toString(),
      },
    ],
    facultyQueryParam: apiData.slug,
  };
}
