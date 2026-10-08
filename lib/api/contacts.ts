import { publicFetch } from "@/lib/server-fetch";

interface ContactRecord {
  officeName: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  mapUrl?: string | string[] | null;
  availableHours?: string | null;
  type: string;
}

export type AdministrationContact = Pick<
  ContactRecord,
  "officeName" | "address" | "phone" | "email" | "mapUrl" | "availableHours"
>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionalText(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

function parseContact(value: unknown, index: number): ContactRecord {
  if (
    !isRecord(value) ||
    typeof value.officeName !== "string" ||
    typeof value.type !== "string" ||
    !isOptionalText(value.address) ||
    !isOptionalText(value.phone) ||
    !isOptionalText(value.email) ||
    !isOptionalText(value.availableHours) ||
    !(
      value.mapUrl === undefined ||
      value.mapUrl === null ||
      typeof value.mapUrl === "string" ||
      (Array.isArray(value.mapUrl) &&
        value.mapUrl.every((url) => typeof url === "string"))
    )
  ) {
    throw new Error(`Invalid contact record at index ${index}`);
  }

  return {
    officeName: value.officeName,
    address: value.address,
    phone: value.phone,
    email: value.email,
    mapUrl: value.mapUrl,
    availableHours: value.availableHours,
    type: value.type,
  };
}

export async function getAdministrationContacts(): Promise<{
  contacts: AdministrationContact[];
  error: boolean;
}> {
  try {
    const response = await publicFetch.get("/contacts/public", {
      next: { revalidate: 300, tags: ["public-contacts"] },
    });

    if (!response.ok) {
      throw new Error(`Contacts request failed (${response.status})`);
    }

    let payload: unknown = await response.json();

    if (isRecord(payload)) {
      if (payload.success === false) {
        throw new Error(
          typeof payload.message === "string"
            ? payload.message
            : "Contacts API reported an unsuccessful response",
        );
      }

      if ("data" in payload) {
        payload = payload.data;
      }
    }

    if (isRecord(payload) && "officeName" in payload) {
      payload = [payload];
    }

    if (!Array.isArray(payload)) {
      throw new Error("Contacts API returned an invalid response");
    }

    const contacts = payload
      .map(parseContact)
      .filter((contact) => contact.type === "ADMINISTRATION")
      .map(
        ({
          officeName,
          address,
          phone,
          email,
          mapUrl,
          availableHours,
        }) => ({
          officeName,
          address,
          phone,
          email,
          mapUrl,
          availableHours,
        }),
      );

    return { contacts, error: false };
  } catch (error) {
    console.error("[Contacts] Failed to load public contacts:", error);
    return { contacts: [], error: true };
  }
}
