const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// AUTH
export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json() as Promise<{ id: number; username: string; email: string }>;
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// SKILLS
export async function getSkills() {
  const res = await fetch(`${BASE_URL}/skills`);
  if (!res.ok) throw new Error("Failed to fetch skills");
  return res.json();
}

export async function postSkill(data: {
  title: string;
  description: string;
  category: string;
  location: string;
  needsInReturn: string;
}) {
  const res = await fetch(`${BASE_URL}/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post skill");
  return res.json();
}