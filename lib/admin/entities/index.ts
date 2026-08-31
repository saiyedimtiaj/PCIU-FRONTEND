import type { EntitySchema } from "@/components/admin/form/form-types";

import { departmentEntity } from "./department";
import { facultyEntity } from "./faculty";
import { programEntity } from "./program";
import { courseEntity } from "./course";
import { labFaciliteEntity } from "./lab-facilite";

import { teacherEntity } from "./teacher";
import { educationEntity } from "./education";
import { experienceEntity } from "./experience";
import { membershipEntity } from "./membership";
import { awardsEntity } from "./awards";
import { userEntity } from "./user";

import { semesterEntity } from "./semester";
import { examEntity } from "./exam";
import { batchEntity } from "./batch";
import { sectionEntity } from "./section";
import { buildingEntity } from "./building";
import { roomEntity } from "./room";
import { timeSlotEntity } from "./time-slot";
import { classRoutineEntity } from "./class-routine";
import { examRoutineEntity } from "./exam-routine";

import { pagesEntity } from "./pages";
import { heroSlidesEntity } from "./hero-slides";
import { newsArticlesEntity } from "./news-articles";
import { eventsEntity } from "./events";
import { activitiesEntity } from "./activities";
import { noticesEntity } from "./notices";
import { galleryEntity } from "./gallery";
import { menusEntity } from "./menus";

import { researchCentresEntity } from "./research-centres";
import { researchAreasEntity } from "./research-areas";
import { researchPublicationsEntity } from "./research-publications";
import { seminarEntity } from "./seminar";
import { partnersEntity } from "./partners";
import { mousEntity } from "./mous";

import { pcjVolumesEntity } from "./pcj-volumes";
import { pcjArticlesEntity } from "./pcj-articles";

import { admissionAdvertisementsEntity } from "./admission-advertisements";
import { admissionSchedulesEntity } from "./admission-schedules";
import { admissionTestResultsEntity } from "./admission-test-results";
import { feeStructuresEntity } from "./fee-structures";
import { mbaEligibilityTiersEntity } from "./mba-eligibility-tiers";
import { faqsEntity } from "./faqs";

import { iqacEntity } from "./iqac";
import { iqacCommitteeEntity } from "./iqac-committee";
import { iqacSectionsEntity } from "./iqac-sections";
import { iqacDocumentsEntity } from "./iqac-documents";
import { iqacQuickLinksEntity } from "./iqac-quick-links";
import { managementEntity } from "./management";

import { contactEntity } from "./contact";
import { settingEntity } from "./setting";
import { popupEntity } from "./popup";

export const ENTITY_REGISTRY: Record<string, EntitySchema> = {
  department: departmentEntity,
  faculty: facultyEntity,
  program: programEntity,
  course: courseEntity,
  "lab-facilite": labFaciliteEntity,

  teacher: teacherEntity,
  education: educationEntity,
  experience: experienceEntity,
  membership: membershipEntity,
  awards: awardsEntity,
  user: userEntity,

  semester: semesterEntity,
  exam: examEntity,
  batch: batchEntity,
  section: sectionEntity,
  building: buildingEntity,
  room: roomEntity,
  "time-slot": timeSlotEntity,
  "class-routine": classRoutineEntity,
  "exam-routine": examRoutineEntity,

  pages: pagesEntity,
  "hero-slides": heroSlidesEntity,
  "news-articles": newsArticlesEntity,
  events: eventsEntity,
  activities: activitiesEntity,
  notices: noticesEntity,
  gallery: galleryEntity,
  menus: menusEntity,

  "research-centres": researchCentresEntity,
  "research-areas": researchAreasEntity,
  "research-publications": researchPublicationsEntity,
  seminar: seminarEntity,
  partners: partnersEntity,
  mous: mousEntity,

  "pcj-volumes": pcjVolumesEntity,
  "pcj-articles": pcjArticlesEntity,

  "admission-advertisements": admissionAdvertisementsEntity,
  "admission-schedules": admissionSchedulesEntity,
  "admission-test-results": admissionTestResultsEntity,
  "fee-structures": feeStructuresEntity,
  "mba-eligibility-tiers": mbaEligibilityTiersEntity,
  faqs: faqsEntity,

  iqac: iqacEntity,
  "iqac-committee": iqacCommitteeEntity,
  "iqac-sections": iqacSectionsEntity,
  "iqac-documents": iqacDocumentsEntity,
  "iqac-quick-links": iqacQuickLinksEntity,
  management: managementEntity,

  contact: contactEntity,
  setting: settingEntity,
  popup: popupEntity,
};

export const ENTITY_GROUP_ORDER = [
  "Academics",
  "People",
  "Scheduling",
  "Content",
  "Research",
  "Journal",
  "Admission",
  "IQAC",
  "System",
] as const;

export function getEntitySchema(slug: string): EntitySchema | undefined {
  return ENTITY_REGISTRY[slug];
}
