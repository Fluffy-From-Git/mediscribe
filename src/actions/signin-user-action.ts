"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
type Res =
  | { success: true }
  | { success: false; error: string; statusCode: 500 | 401 };

export async function signInUserAction(values: unknown): Promise<Res> {
  try {
    if (
      typeof values !== "object" ||
      values === null ||
      Array.isArray(values)
    ) {
      return {
        success: false,
        error: "Invalid input",
        statusCode: 500,
      };
    }

    await signIn("credentials", { ...values, redirect: false });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return {
            success: false,
            error: "Invalid credentials",
            statusCode: 401,
          };
        default:
          return {
            success: false,
            error: "Ooops! Something went wrong",
            statusCode: 500,
          };
      }
    }
    return {
      success: false,
      error: "internal server error",
      statusCode: 500,
    };
  }
}
