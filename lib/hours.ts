// Clinic hours, always evaluated in clinic time (Asia/Manila).

const OPEN = 9 * 60;
const CLOSE = 18 * 60;
const SUN_OPEN = 14 * 60;
const SUN_CLOSE = 17 * 60;
const DAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export type ClinicTime = { day: number; minutes: number };
export type ClinicStatus = { state: "open" | "appt" | "closed"; text: string };

let formatter: Intl.DateTimeFormat | undefined;

export function clinicNow(date = new Date()): ClinicTime {
  formatter ??= new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: DAYS[get("weekday")], minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function describe({ day, minutes }: ClinicTime): ClinicStatus {
  if (day === 0) {
    if (minutes < SUN_OPEN) return { state: "appt", text: "Open today 2:00 – 5:00 PM, by appointment only" };
    if (minutes < SUN_CLOSE) return { state: "appt", text: "Open by appointment until 5:00 PM" };
    return { state: "closed", text: "Closed now. Opens Monday at 9:00 AM" };
  }
  if (minutes < OPEN) return { state: "closed", text: "Closed now. Opens today at 9:00 AM" };
  if (minutes < CLOSE) return { state: "open", text: "Open now until 6:00 PM" };
  if (day === 6) return { state: "closed", text: "Closed now. Sunday hours are 2:00 – 5:00 PM, by appointment" };
  return { state: "closed", text: "Closed now. Opens tomorrow at 9:00 AM" };
}

export const weeklyHours = [
  { day: 1, name: "Monday", hours: "9:00 AM – 6:00 PM" },
  { day: 2, name: "Tuesday", hours: "9:00 AM – 6:00 PM" },
  { day: 3, name: "Wednesday", hours: "9:00 AM – 6:00 PM" },
  { day: 4, name: "Thursday", hours: "9:00 AM – 6:00 PM" },
  { day: 5, name: "Friday", hours: "9:00 AM – 6:00 PM" },
  { day: 6, name: "Saturday", hours: "9:00 AM – 6:00 PM" },
  { day: 0, name: "Sunday", hours: "2:00 – 5:00 PM", note: "By appointment only" },
] as const;
