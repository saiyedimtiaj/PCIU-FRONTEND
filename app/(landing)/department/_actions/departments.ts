"use server";

import { publicFetch } from "@/lib/server-fetch";
import type {
  ApiDepartmentResponse,
  DepartmentContent,
  ApiTeacher,
  ApiEvent,
  ApiDepartmentNotice,
  ApiResearch,
  ApiCourse,
  ApiTuitionFee,
  ApiProgram,
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

        const [
          teachersRes,
          eventsRes,
          noticesRes,
          researchRes,
          coursesRes,
          tuitionRes,
          programsRes,
        ] = await Promise.all([
          publicFetch.get(`/teachers/department/${deptId}`, {
            next: { tags: ["department-teachers", slug] },
          }),
          publicFetch.get(`/department/events/${deptId}`, {
            next: { tags: ["department-events", slug] },
          }),
          publicFetch.get(`/department/notices/${deptId}`, {
            next: { tags: ["department-notices", slug] },
          }),
          publicFetch.get(`/department/research-centres/${deptId}`, {
            next: { tags: ["department-research", slug] },
          }),
          publicFetch.get(`/department/courses/${deptId}`, {
            next: { tags: ["department-courses", slug] },
          }),
          publicFetch.get(`/admission/tuitionfees`, {
            next: { tags: ["tuitionfees"] },
          }),
          publicFetch.get(`/department/programs/${slug}`, {
            next: { tags: ["department-programs", slug] },
          }),
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

        let notices: ApiDepartmentNotice[] = [];
        if (noticesRes.ok) {
          const nData = await noticesRes.json();
          if (nData.success && Array.isArray(nData.data)) {
            notices = nData.data;
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
            tuitionFees = tfData.data.filter(
              (fee: ApiTuitionFee) => fee.departmentName === data.data.name,
            );
          }
        }

        let programs: ApiProgram[] = [];
        if (programsRes.ok) {
          const pData = await programsRes.json();
          if (pData.success && Array.isArray(pData.data)) {
            programs = pData.data;
          }
        }

        return mapApiDepartmentToContent(
          data.data,
          teachers,
          events,
          notices,
          research,
          courses,
          tuitionFees,
          programs,
        );
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
  notices: ApiDepartmentNotice[],
  research: ApiResearch[],
  courses: ApiCourse[],
  tuitionFees: ApiTuitionFee[],
  programs: ApiProgram[],
): DepartmentContent {
  return {
    id: apiData.id,
    slug: apiData.slug,
    image: apiData.image,
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
          bio: apiData.chairman.bio,
          imageUrl: apiData.chairman.imageUrl,
        }
      : null,
    overview: {
      content: [apiData.description],
      hasImage: !!apiData.image,
    },
    facilities: [], // Empty state
    programs: programs.map((p) => ({
      id: p.id,
      name: p.title || "Program",
      duration: p.duration ? `${p.duration} Years` : "",
      credits: p.credit?.toString() || "",
      description: p.programType || "",
      concentrations: [],
    })),
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
    notices: notices
      .filter((notice) => notice.isActive !== false)
      .sort((a, b) => getNoticeTimestamp(b) - getNoticeTimestamp(a))
      .map((notice) => ({
        id: notice.id,
        title: notice.title?.trim() || "Untitled notice",
        date: notice.noticeDate ?? notice.createdAt ?? "",
        category: notice.category?.trim() || "General",
        badgeLabel: notice.badgeLabel ?? null,
        pdfUrl: notice.pdfUrl ?? null,
      })),
    events: sortDepartmentEvents(events)
      .filter((event) => event.isActive !== false)
      .map((event) => ({
        id: event.id,
        slug: event.slug?.trim() || "",
        title: event.title?.trim() || "Untitled event",
        summary: stripHtml(event.description),
        category: event.category ?? null,
        badgeLabel: event.badgeLabel ?? null,
        startDateTime: event.startDateTime ?? "",
        endDateTime: event.endDateTime ?? null,
        allDay: event.allDay ?? false,
        location: event.location ?? null,
        coverImageUrl: event.coverImageUrl ?? null,
      })),
    contact: {
      address: apiData.officeLocation,
      phone: apiData.phone,
      email: apiData.email,
      hours: "Sunday - Thursday: 9:00 AM - 5:00 PM",
    },
    quickLinks: (apiData.quickLink || []).flatMap((link) => {
      // Older rows are bare strings with no destination; newer ones are
      // `{ title, url }` objects. Rendering the object straight into `label`
      // crashed the prerender of every department page.
      if (typeof link === "string") {
        return link ? [{ label: link, url: "#" }] : [];
      }
      const label = link?.title ?? link?.label ?? link?.name;
      return label ? [{ label, url: link?.url || "#" }] : [];
    }),
    facultyMembers: teachers.map((t) => ({
      id: t.id,
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

function toTimestamp(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getNoticeTimestamp(notice: ApiDepartmentNotice): number {
  return toTimestamp(notice.noticeDate ?? notice.createdAt);
}

/**
 * Upcoming events first (soonest at the top), then past events (most recent
 * first). Events without a start date sink to the bottom.
 */
function sortDepartmentEvents(events: ApiEvent[]): ApiEvent[] {
  const now = Date.now();

  return [...events].sort((a, b) => {
    const aTime = toTimestamp(a.startDateTime);
    const bTime = toTimestamp(b.startDateTime);

    if (!aTime) return 1;
    if (!bTime) return -1;

    const aUpcoming = aTime >= now;
    const bUpcoming = bTime >= now;

    if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;

    return aUpcoming ? aTime - bTime : bTime - aTime;
  });
}

function stripHtml(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getDepartmentTeachers(
  deptId: number,
  slug: string,
): Promise<ApiTeacher[]> {
  try {
    const teachersRes = await publicFetch.get(
      `/teachers/department/${deptId}`,
      { next: { tags: ["department-teachers", slug] } },
    );
    if (teachersRes.ok) {
      const tData = await teachersRes.json();
      if (tData.success && tData.data?.teachers) {
        return tData.data.teachers;
      }
    }
  } catch (error) {
    console.error(
      `[Actions: getDepartmentTeachers] Failed to fetch teachers for dept ${deptId}:`,
      error,
    );
  }
  return [];
}
