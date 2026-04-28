import { ChatMessage, DayAdherence, DoseLog, Medication, PatientSummary, RiskInfo, User } from "./types";

export const demoPatient: User = {
  id: "u_aziza",
  full_name: "Aziza Karimova",
  phone: "+998901111111",
  role: "patient",
  age: 45,
  gender: "F",
  language: "uz",
};

export const demoFamily: User = {
  id: "u_bobur",
  full_name: "Bobur Karimov",
  phone: "+998902222222",
  role: "family",
  age: 48,
  gender: "M",
};

export const demoDoctor: User = {
  id: "u_sanjar",
  full_name: "Dr. Sanjar Aliyev",
  phone: "+998903333333",
  role: "doctor",
  age: 39,
  gender: "M",
};

export const demoMedications: Medication[] = [
  { id: "m1", name: "Isoniazid", dosage: "300mg", disease: "TB", instructions: "Ovqatdan oldin", times: ["08:00", "20:00"], startDate: "2026-04-01", active: true, adherence30d: 92 },
  { id: "m2", name: "Rifampicin", dosage: "600mg", disease: "TB", instructions: "Ertalab nahorda", times: ["08:00"], startDate: "2026-04-01", active: true, adherence30d: 88 },
  { id: "m3", name: "Pyrazinamide", dosage: "1500mg", disease: "TB", instructions: "Ovqat bilan", times: ["14:00"], startDate: "2026-04-01", active: true, adherence30d: 78 },
];

export const todayDoses: DoseLog[] = [
  { id: "d1", medicationId: "m1", medName: "Isoniazid", dosage: "300mg", scheduledTime: "08:00", status: "taken", takenAt: "08:05", instructions: "Ovqatdan oldin" },
  { id: "d2", medicationId: "m2", medName: "Rifampicin", dosage: "600mg", scheduledTime: "08:00", status: "taken", takenAt: "08:05", instructions: "Ertalab nahorda" },
  { id: "d3", medicationId: "m3", medName: "Pyrazinamide", dosage: "1500mg", scheduledTime: "14:00", status: "upcoming", instructions: "Ovqat bilan" },
  { id: "d4", medicationId: "m1", medName: "Isoniazid", dosage: "300mg", scheduledTime: "20:00", status: "upcoming", instructions: "Ovqatdan oldin" },
];

export function generateAdherence(days = 90): DayAdherence[] {
  const arr: DayAdherence[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    // Simulated 85% with recent decline
    const noise = Math.random();
    let rate: number;
    if (i < 5) rate = 0.4 + Math.random() * 0.5;
    else if (i < 14) rate = 0.7 + Math.random() * 0.3;
    else rate = 0.8 + Math.random() * 0.2;
    if (noise < 0.04) rate = 0; // missed full day
    const scheduled = 4;
    const taken = Math.round(rate * scheduled);
    arr.push({ date, taken, scheduled, rate: scheduled === 0 ? -1 : taken / scheduled });
  }
  return arr;
}

export const currentRisk: RiskInfo = {
  score: 67,
  level: "high",
  factors: [
    { label: "Oxirgi 5 kun rioya pasayishi", weight: 35 },
    { label: "Tushdan keyingi dozalar tez-tez o'tkaziladi", weight: 18 },
    { label: "Charchoq haqida xabarlar ko'paydi", weight: 14 },
  ],
};

export function initialChatHistory(): ChatMessage[] {
  return [
    { id: "c0", role: "ai", text: "Salom Aziza opa! Men sizning AI Hamrohingizman 💚 Davolanishingiz haqida har qanday savol bera olasiz.", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  ];
}

export function aiReply(input: string): { text: string; riskFlag?: boolean; suggested?: { label: string; type: string }[] } {
  const t = input.toLowerCase();
  if (/(yomon|charcha|kasal|плохо|устал|болею|sad|tired|sick|terrible)/.test(t)) {
    return {
      text: "Buni eshitganimdan afsusdaman. Bu his-tuyg'ular davolanish jarayonida tez-tez bo'ladi. Bugun nima sizni qiynayapti?\n\nAgar yomon his qilsangiz — yaqiningiz yoki shifokoringiz bilan bog'lanishni tavsiya qilaman.",
      riskFlag: true,
      suggested: [{ label: "👨‍⚕️ Shifokorga murojaat", type: "doctor" }, { label: "👨‍👩‍👧 Oilaga xabar", type: "family" }],
    };
  }
  if (/(yon ta'sir|side|побочк)/.test(t)) {
    return { text: "Yon ta'sirni eshitganimdan afsusdaman. Iltimos, qanday belgilarni sezayapsiz? Aniqroq bo'lishingiz uchun:\n• Qachondan boshlandi?\n• Qaysi dorini ichganingizdan keyin?\n\nBu ma'lumotlarni shifokoringizga ham yetkazaman." };
  }
  if (/(unut|forgot|забыл)/.test(t)) {
    return { text: "Hech kim mukammal emas — bu odatiy hol. Hozir vaqt o'tib ketgan bo'lsa ham, dozani ichib qo'yishni tavsiya qilaman (agar keyingi vaqtga 4 soatdan ko'p bo'lsa).\n\nKeyingi dozani o'z vaqtida ichishni unutmang." };
  }
  return { text: "Tushunarli. Yana batafsilroq aytib bera olasizmi? Sizga to'g'ri yordam berish uchun shifokoringizning ko'rsatmalariga ham qarayman." };
}

// ----- Family / Doctor patients -----
export const patients: PatientSummary[] = [
  {
    id: "u_aziza", name: "Aziza Karimova", age: 45, disease: "TB", adherence: 85,
    risk: { score: 78, level: "high", factors: [] },
    lastSeen: "2 soat oldin",
    spark: Array.from({ length: 30 }, (_, i) => 60 + Math.round(Math.sin(i / 3) * 15) + Math.round(Math.random() * 10)),
  },
  {
    id: "p_dilshod", name: "Dilshod Yusupov", age: 62, disease: "Hypertension", adherence: 91,
    risk: { score: 28, level: "low", factors: [] },
    lastSeen: "30 daq oldin",
    spark: Array.from({ length: 30 }, () => 80 + Math.round(Math.random() * 18)),
  },
  {
    id: "p_marina", name: "Marina Petrova", age: 54, disease: "Diabetes", adherence: 62,
    risk: { score: 88, level: "critical", factors: [] },
    lastSeen: "1 kun oldin",
    spark: Array.from({ length: 30 }, (_, i) => 90 - i * 1.2 + Math.round(Math.random() * 15)),
  },
  {
    id: "p_kamol", name: "Kamol Tursunov", age: 49, disease: "TB", adherence: 78,
    risk: { score: 52, level: "medium", factors: [] },
    lastSeen: "5 soat oldin",
    spark: Array.from({ length: 30 }, () => 70 + Math.round(Math.random() * 25)),
  },
  {
    id: "p_zarina", name: "Zarina Saidova", age: 38, disease: "Hypertension", adherence: 95,
    risk: { score: 18, level: "low", factors: [] },
    lastSeen: "10 daq oldin",
    spark: Array.from({ length: 30 }, () => 88 + Math.round(Math.random() * 12)),
  },
  {
    id: "p_otabek", name: "Otabek Rahimov", age: 57, disease: "Diabetes", adherence: 71,
    risk: { score: 64, level: "high", factors: [] },
    lastSeen: "3 soat oldin",
    spark: Array.from({ length: 30 }, () => 60 + Math.round(Math.random() * 30)),
  },
  {
    id: "p_nigora", name: "Nigora Abdullaeva", age: 41, disease: "TB", adherence: 88,
    risk: { score: 35, level: "medium", factors: [] },
    lastSeen: "1 soat oldin",
    spark: Array.from({ length: 30 }, () => 78 + Math.round(Math.random() * 20)),
  },
];
