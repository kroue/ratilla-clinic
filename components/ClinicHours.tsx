"use client";

import { useSyncExternalStore } from "react";
import { clinicNow, describe, weeklyHours, type ClinicTime } from "@/lib/hours";

// Clinic time as one number (day * 1440 + minutes) so React can compare snapshots.
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 30_000);
  return () => clearInterval(timer);
}

function getSnapshot() {
  try {
    const { day, minutes } = clinicNow();
    return Number.isInteger(day) && Number.isFinite(minutes) ? day * 1440 + minutes : -1;
  } catch {
    // No timezone support: the static hours still show.
    return -1;
  }
}

function getServerSnapshot() {
  return -1;
}

function useClinicTime(): ClinicTime | null {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return value < 0 ? null : { day: Math.floor(value / 1440), minutes: value % 1440 };
}

export function OpenStatus() {
  const now = useClinicTime();
  if (!now) return null;
  const { state, text } = describe(now);
  return (
    <p className="status" data-state={state}>
      <span className="status-dot" aria-hidden="true" />
      <span>{text}</span>
    </p>
  );
}

export function HoursTable() {
  const now = useClinicTime();
  return (
    <table className="hours-table">
      <caption className="visually-hidden">Clinic opening hours by day</caption>
      <tbody>
        {weeklyHours.map((row) => {
          const isToday = now?.day === row.day;
          return (
            <tr key={row.day} className={isToday ? "is-today" : undefined}>
              <th scope="row">
                {row.name}
                {isToday && <span className="today-tag">Today</span>}
              </th>
              <td>
                {row.hours}
                {"note" in row && <span className="appt">{row.note}</span>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
