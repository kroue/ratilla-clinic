"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminConfigured, endSession, passwordMatches, requireAdmin, startSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { leads, leadStatus, type LeadStatus } from "@/lib/db/schema";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "Admin access isn't set up yet. Add ADMIN_PASSWORD to the project's environment variables." };
  }
  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    // Slow down repeated guesses.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "That password isn't right." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function setLeadStatus(id: number, status: LeadStatus) {
  await requireAdmin();
  if (!leadStatus.enumValues.includes(status)) throw new Error("Unknown status");
  const db = await getDb();
  await db.update(leads).set({ status }).where(eq(leads.id, id));
  revalidatePath("/admin");
}

export async function deleteLead(id: number) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(leads).where(eq(leads.id, id));
  revalidatePath("/admin");
}
