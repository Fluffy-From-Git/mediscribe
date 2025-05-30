"use server";
import { findUserShiftsByEmail } from "@/resources/user-queries";

export async function getShifts(email: string) {
  const shifts = await findUserShiftsByEmail(email);

  return shifts;
}
