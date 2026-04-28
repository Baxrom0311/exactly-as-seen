import { aiReply, currentRisk, demoDoctor, demoFamily, demoPatient, generateAdherence, initialChatHistory, patients, todayDoses } from "./mockData";
import { ChatMessage, Role, User } from "./types";

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function userByRole(role: Role): User {
  if (role === "family") return demoFamily;
  if (role === "doctor") return demoDoctor;
  return demoPatient;
}

export const mockApi = {
  async login(phone: string, _password: string) {
    await wait(400);
    // demo: route by phone suffix
    let role: Role = "patient";
    if (phone.endsWith("22") || phone.endsWith("2222")) role = "family";
    if (phone.endsWith("33") || phone.endsWith("3333")) role = "doctor";
    const user = userByRole(role);
    return { user, access_token: "demo_token_" + role };
  },
  async register(data: { full_name: string; phone: string; role: Role; age?: number; gender?: "M" | "F"; language?: "uz" | "ru" | "en" }) {
    await wait(500);
    const user: User = { id: "u_" + Date.now(), ...data };
    return { user, access_token: "demo_token_new" };
  },
  async todayMeds() { await wait(200); return todayDoses; },
  async risk() { await wait(150); return currentRisk; },
  async logAdherence(doseId: string) {
    await wait(200);
    const d = todayDoses.find((x) => x.id === doseId);
    if (d) { d.status = "taken"; d.takenAt = new Date().toTimeString().slice(0, 5); }
    return { ok: true };
  },
  async chatHistory() { await wait(150); return initialChatHistory(); },
  async sendChat(text: string): Promise<ChatMessage> {
    await wait(900);
    const r = aiReply(text);
    return {
      id: "c_" + Date.now(),
      role: "ai",
      text: r.text,
      timestamp: new Date().toISOString(),
      riskFlag: r.riskFlag,
      suggestedActions: r.suggested,
    };
  },
  async checkIn(_mood: string) {
    await wait(250);
    return { reply: "Rahmat! Sizni eshitganimdan xursandman. Bugun ham yaxshi kun bo'lsin 💚" };
  },
  async medications() { await wait(200); return [...(await import("./mockData")).demoMedications]; },
  async addMedication(m: any) { await wait(400); return { id: "m_" + Date.now(), ...m, active: true, adherence30d: 0 }; },
  async adherenceHistory(days = 30) { await wait(250); return generateAdherence(days); },
  async patients() { await wait(200); return patients; },
  async patient(id: string) { await wait(150); return patients.find((p) => p.id === id) ?? patients[0]; },
};
