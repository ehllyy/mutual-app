// Demo data shown when the backend API can't be reached,
// so the deployed frontend still shows the browsing experience.

export interface DemoSkill {
  id: number;
  title: string;
  needsInReturn: string;
  category: string;
  location: string;
  username: string;
  description?: string;
}

export const DEMO_SKILLS: DemoSkill[] = [
  { id: 1, title: "Braiding & cornrows", needsInReturn: "Help with Excel", category: "Beauty & Care", location: "Anaji, Takoradi", username: "Akosua Mensah", description: "Neat knotless braids and cornrows. I can come to you on weekends." },
  { id: 2, title: "Basic plumbing repairs", needsInReturn: "Kids' maths lessons", category: "Home & Trade", location: "Effiakuma, Takoradi", username: "Kwame Asante", description: "Leaking taps, blocked sinks and small pipe fixes." },
  { id: 3, title: "Jollof & party cooking", needsInReturn: "Phone photography tips", category: "Food & Cooking", location: "East Legon, Accra", username: "Efua Owusu", description: "I can teach you my jollof or help cook for small gatherings." },
  { id: 4, title: "Morning fitness sessions", needsInReturn: "Meal prep ideas", category: "Fitness & Sport", location: "Osu, Accra", username: "Yaw Boateng", description: "Beginner-friendly workouts at the beach or park, 3x a week." },
  { id: 5, title: "JHS maths tutoring", needsInReturn: "Hair braiding", category: "Education", location: "Anaji, Takoradi", username: "Ama Darko", description: "Patient tutoring for JHS students preparing for BECE." },
  { id: 6, title: "Logo & flyer design", needsInReturn: "Guitar lessons", category: "Creative & Arts", location: "Airport Ridge, Takoradi", username: "Nana Adjei", description: "Simple brand logos and event flyers for small businesses." },
  { id: 7, title: "Laptop setup & fixes", needsInReturn: "Plumbing help", category: "Tech", location: "Tema Community 25", username: "Kofi Annor", description: "Slow laptops, Windows installs, printer setup and backups." },
  { id: 8, title: "Guitar for beginners", needsInReturn: "Logo for my band", category: "Music & Dance", location: "Madina, Accra", username: "Esi Quaye", description: "Learn your first chords and songs in a few weeks." },
  { id: 9, title: "Excel & spreadsheets", needsInReturn: "Fitness coaching", category: "Tech", location: "Kasoa", username: "Abena Fosu", description: "Formulas, tables and simple budgets for your business." },
];

export const DEMO_ABOUT: Record<string, string> = {
  "Akosua Mensah": "Hairstylist on weekends, learning to manage my shop's records.",
  "Kwame Asante": "Handyman and dad of two. Happy to fix things around the neighbourhood.",
  "Efua Owusu": "Home cook who loves feeding people.",
  "Yaw Boateng": "Fitness enthusiast helping neighbours get moving.",
  "Ama Darko": "Teacher by day, always happy to help students.",
  "Nana Adjei": "Freelance designer for small businesses.",
  "Kofi Annor": "IT support guy, good with stubborn laptops.",
  "Esi Quaye": "Musician and part-time guitar teacher.",
  "Abena Fosu": "Accountant who loves a clean spreadsheet.",
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Fetch skills from the API, falling back to demo data if the API is unavailable. */
export async function fetchSkillsWithFallback(): Promise<DemoSkill[]> {
  try {
    const res = await fetch(`${BASE_URL}/skills`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return DEMO_SKILLS;
  } catch {
    return DEMO_SKILLS;
  }
}
