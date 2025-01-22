import React from "react";
import SignInForm from "./_components/signin-form";

export default function SignInPage() {
  return (
    <main className="mt-4">
      <div className="container mx-auto max-w-[400px]">
        <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
        <div className="my-4 h-1 bg-muted" />
        {/*  SignIn Form */}
        <SignInForm />
        {/* Go to SignIn Link */}
      </div>
    </main>
  );
}
