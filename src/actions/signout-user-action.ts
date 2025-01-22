"use server";
import { signOut } from "@/auth";

export async function signOutUserAction() {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.error(error);
  }
}
