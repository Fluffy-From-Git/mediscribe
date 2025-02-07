import "server-only";
import db from "@/drizzle";
import { users, lower, clients, shifts } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (
  email: string,
): Promise<typeof users.$inferSelect | null> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()))
    .then((res) => res[0] ?? null);

  return user;
};

export const findUserShiftsByEmail = async (email: string) => {
  try {
    const userShifts = await db
      .select({
        clientName: clients.name,
        start: shifts.start,
        end: shifts.end,
        address: clients.address,
      })
      .from(shifts)
      .innerJoin(users, eq(shifts.userId, users.id))
      .innerJoin(clients, eq(shifts.clientId, clients.id))
      .where(eq(users.email, email));
    console.log(userShifts);
    return userShifts;
  } catch (error) {
    console.error("Error finding user shifts:", error);
    throw error; // Re-throw the error for handling at the caller level
  }
};
