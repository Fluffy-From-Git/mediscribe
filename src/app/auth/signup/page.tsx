import React from "react";
import SignUpForm from "./_components/signup-form";

export default function SignUpPage() {
  return (
    <main className="mt-4">
      <div className="container mx-auto max-w-[400px]">
        <h1 className="text-3xl font-bold tracking-tight">Sign Up</h1>
        <div className="my-4 h-1 bg-muted" />
        {/*  Signup Form */}
        <SignUpForm />
        {/* Go to SignIn Link */}
      </div>
    </main>
  );
}
