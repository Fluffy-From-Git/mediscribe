// import { auth } from "@/auth";
import { SignOutButton } from "@/components/signout-button";
import React from "react";

export default async function ProfilePage() {
  // const session = await auth();

  return (
    <main className="mt-4">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight">Profile Page</h1>
        <div className="my-4 h-1 bg-muted" />
        <SignOutButton />
      </div>
    </main>
  );
}
