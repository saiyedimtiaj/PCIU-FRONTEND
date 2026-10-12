import type { Metadata } from "next";
import Contacts from "./Contacts";
import { getAdministrationContacts } from "@/lib/api/contacts";

export const metadata: Metadata = {
  title: "Contacts | Port City International University",
  description:
    "Find administration office contact details and office hours at Port City International University.",
};

export default async function ContactsPage() {
  const { contacts, error } = await getAdministrationContacts();

  return <Contacts contacts={contacts} error={error} />;
}
