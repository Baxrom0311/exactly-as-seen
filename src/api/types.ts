export type Role = "patient" | "family" | "doctor";

export interface User {
  id: string;
  full_name: string;
  phone: string;
  role: Role;
  age?: number;
  gender?: "M" | "F";
  language?: "uz" | "ru" | "en";
  avatar?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  disease: string;
  instructions?: string;
  times: string[]; // "HH:mm"
  startDate: string;
  endDate?: string;
  active: boolean;
  adherence30d: number; // %
}

export type DoseStatus = "taken" | "upcoming" | "missed" | "snoozed";

export interface DoseLog {
  id: string;
  medicationId: string;
  medName: string;
  dosage: string;
  scheduledTime: string; // "HH:mm"
  status: DoseStatus;
  takenAt?: string;
  notes?: string;
  instructions?: string;
}

export interface DayAdherence {
  date: string; // YYYY-MM-DD
  taken: number;
  scheduled: number;
  rate: number; // 0..1, -1 if not scheduled
}

export interface RiskInfo {
  score: number; // 0-100
  level: "low" | "medium" | "high" | "critical";
  factors: { label: string; weight: number }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string;
  riskFlag?: boolean;
  suggestedActions?: { label: string; type: string }[];
}

export interface PatientSummary {
  id: string;
  name: string;
  age: number;
  disease: string;
  adherence: number; // %
  risk: RiskInfo;
  lastSeen: string;
  spark: number[]; // last 30 days
  avatar?: string;
}
