/** Shape returned by `GET /auth/me`. */
export interface SessionUser {
  name: string;
  image: string | null;
  role: string;
  email?: string;
  id?: number;
  phone?: string | null;
  emailVerified?: boolean;
}
