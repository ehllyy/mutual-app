const KEY = "mutual_user";

export type AuthUser = { name: string; email: string; neighbourhood?: string };

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) !== null;
}

export function login(name: string, email: string, neighbourhood = ""): void {
  localStorage.setItem(KEY, JSON.stringify({ name, email, neighbourhood }));
  window.dispatchEvent(new Event("mutual-auth-change"));
}

export function logout(): void {
  localStorage.removeItem(KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as AuthUser;
    if (!user.neighbourhood) {
      user.neighbourhood = localStorage.getItem("mutual_neighbourhood") ?? "";
    }
    return user;
  } catch {
    return null;
  }
}
