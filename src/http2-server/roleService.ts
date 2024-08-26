import { Exception } from "./exception";

export function hasRole(user, role: string) {
  if (user.role == role) return true;

  throw Exception.notEnoughPermisson({ userId: user.id, role });
}
