import React from "react";
import NavbarClient from "./NavbarClient";
import { getFaculties } from "@/actions/faculties";

export default async function Navbar() {
  const fetchedFaculties = await getFaculties();

  return <NavbarClient fetchedFaculties={fetchedFaculties} />;
}
