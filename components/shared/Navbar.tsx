import { getFaculties } from "@/app/(landing)/department/_actions/faculties";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const fetchedFaculties = await getFaculties();

  return <NavbarClient fetchedFaculties={fetchedFaculties} />;
}
