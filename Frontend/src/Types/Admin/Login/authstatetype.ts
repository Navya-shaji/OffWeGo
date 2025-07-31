import type { AdminUser } from "./Login type";

export type AuthState = {
  isAuthenticated: boolean;
  admin: AdminUser | null;
};
