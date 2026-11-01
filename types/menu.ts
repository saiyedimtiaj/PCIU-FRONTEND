/** Shape of GET /home/menus — the public navigation menus managed from
 *  /admin/content/menus (see lib/admin/entities/menus.ts). */

export type MenuLocation =
  | "HEADER"
  | "TOP_HEADER"
  | "FOOTER_ACADEMICS"
  | "FOOTER_ADMISSION";

export type MenuType = "ACADEMICS" | "ADMISSIONS";

export interface MenuItem {
  id: number;
  parentId: number | null;
  name: string;
  location: MenuLocation;
  /** A site-relative path ("/notices") or an absolute URL. */
  slug: string;
  type: MenuType | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children: MenuItem[];
}

export interface HomeMenus {
  topHeader: MenuItem[];
  header: MenuItem[];
  footer_academics: MenuItem[];
  footer_admission: MenuItem[];
}
