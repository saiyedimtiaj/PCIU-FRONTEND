"use server";

import { publicFetch } from "@/lib/server-fetch";
import type {
  ApiDepartmentResponse,
  DepartmentContent,
  ApiTeacher,
  ApiEvent,
  ApiResearch,
  ApiCourse,
  ApiTuitionFee,
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
        const deptId = data.data.id;
        
        const [teachersRes, eventsRes, researchRes, coursesRes, tuitionRes] = await Promise.all([
          publicFetch.get(`/teachers/department/${deptId}`, { next: { tags: ["department-teachers", slug] } }),
          publicFetch.get(`/department/events/${deptId}`, { next: { tags: ["department-events", slug] } }),
          publicFetch.get(`/department/research-centres/${deptId}`, { next: { tags: ["department-research", slug] } }),
          publicFetch.get(`/department/courses/${deptId}`, { next: { tags: ["department-courses", slug] } }),
          publicFetch.get(`/admission/tuitionfees`, { next: { tags: ["tuitionfees"] } }),
        ]);

        let teachers: ApiTeacher[] = [];
        if (teachersRes.ok) {
          const tData = await teachersRes.json();
          if (tData.success && tData.data?.teachers) {
            teachers = tData.data.teachers;
          }
        }

        let events: ApiEvent[] = [];
        if (eventsRes.ok) {
          const eData = await eventsRes.json();
          if (eData.success && Array.isArray(eData.data)) {
            events = eData.data;
          }
        }

        let research: ApiResearch[] = [];
        if (researchRes.ok) {
          const rData = await researchRes.json();
          if (rData.success && Array.isArray(rData.data)) {
            research = rData.data;
          }
        }

        let courses: ApiCourse[] = [];
        if (coursesRes.ok) {
          const cData = await coursesRes.json();
          if (cData.success && Array.isArray(cData.data)) {
            courses = cData.data;
          }
        }

        let tuitionFees: ApiTuitionFee[] = [];
        if (tuitionRes.ok) {
          const tfData = await tuitionRes.json();
          if (tfData.success && Array.isArray(tfData.data)) {
            // Filter global tuition fees by this specific department's name
            tuitionFees = tfData.data.filter((fee: ApiTuitionFee) => fee.departmentName === data.data.name);
          }
        }

        return mapApiDepartmentToContent(data.data, teachers, events, research, courses, tuitionFees);
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
  teachers: ApiTeacher[],
  events: ApiEvent[],
  research: ApiResearch[],
  courses: ApiCourse[],
  tuitionFees: ApiTuitionFee[],
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
    tuitionFees: tuitionFees.map((tf) => ({
      program: tf.program || "Program",
      credit: tf.credit?.toString() || "0",
      perCreditAmount: tf.perCreditAmount?.toString() || "0",
      totalFees: tf.totalFees || 0,
    })),
    courses: courses.map((c) => ({
      courseName: c.courseName || c.name || c.title || "Course Name",
      courseCode: c.courseCode || c.code || "Course Code",
      credit: c.credit?.toString() || undefined,
    })),
    notices: events.map((e) => ({
      title: e.title || e.name || "Event",
      date: e.date || e.createdAt?.split("T")[0] || "",
      type: e.type || "Event",
    })),
    contact: {
      address: apiData.officeLocation,
      phone: apiData.phone,
      email: apiData.email,
      hours: "Sunday - Thursday: 9:00 AM - 5:00 PM",
    },
    quickLinks: (apiData.quickLink || []).map((link) => ({
      label: link.title,
      url: link.url,
    })),
    facultyMembers: teachers.map((t) => ({
      slug: t.slug || t.id?.toString() || "",
      name: t.name,
      designation: t.designation || "",
      specialization: t.teachingAreas || "",
      imageUrl: t.imageUrl || undefined,
    })),
    researchAreas: research.map((r) => ({
      title: r.title || r.name || "Research Area",
      author: r.author || r.researcher || "Department",
      description: r.description || "",
    })),
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
