import NavbarClient from "./NavbarClient";
import { getFaculties } from "@/actions/faculties";
import { getSession } from "@/app/(auth)/actions";

export default async function Navbar() {
  const fetchedFaculties = await getFaculties();
  const session = await getSession();

  return <NavbarClient fetchedFaculties={fetchedFaculties} session={session} />;
}
