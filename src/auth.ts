import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as v from "valibot";
import { SignInSchema } from "@/validators/signin-validator";
import { findUserByEmail } from "@/resources/user-queries";
import argon2 from "argon2";

const nextAuth = NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = v.safeParse(SignInSchema, credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.output;

        const user = await findUserByEmail(email);
        if (!user) return null;
        if (!user.password) return null;
        if (
          user.domain.toLowerCase() !==
          parsedCredentials.output.domainName.toLowerCase()
        )
          return null;

        const valid = await argon2.verify(user.password, password);

        if (valid) {
          const { password: _, ...rest } = user; // eslint-disable-line
          return rest;
        }

        return null;
      },
    }),
  ],
});

export const { signIn, auth, signOut, handlers } = nextAuth;
