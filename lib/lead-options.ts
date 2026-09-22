// Shared by the request form (client) and its Server Action (server).

export const REASONS = [
  { value: "consultation", label: "General consultation" },
  { value: "chronic", label: "Chronic condition follow-up" },
  { value: "child", label: "Child's check-up or illness" },
  { value: "vaccination", label: "Vaccination" },
  { value: "lab-test", label: "Lab test" },
  { value: "womens-health", label: "Women's health" },
  { value: "mental-health", label: "Mental health" },
  { value: "animal-bite", label: "Animal bite or scratch" },
  { value: "online", label: "Online consultation" },
  { value: "other", label: "Something else" },
] as const;

export const CALL_TIMES = [
  { value: "any", label: "Any time during clinic hours" },
  { value: "morning", label: "Morning (9 AM – 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 – 6 PM)" },
] as const;

export type ReasonValue = (typeof REASONS)[number]["value"];
export type CallTimeValue = (typeof CALL_TIMES)[number]["value"];

export const reasonLabel = (value: string) => REASONS.find((r) => r.value === value)?.label ?? value;
export const callTimeLabel = (value: string | null) =>
  CALL_TIMES.find((t) => t.value === value)?.label ?? "Not specified";

export type LeadField = "name" | "phone" | "email" | "reason" | "preferredTime" | "message" | "consent";

export type LeadFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<LeadField, string>>; values: Partial<Record<LeadField, string>> }
  | { status: "error"; message: string; values: Partial<Record<LeadField, string>> }
  | { status: "success"; firstName: string; phone: string };
