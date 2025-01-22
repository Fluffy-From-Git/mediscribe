"use client";
import { signOutUserAction } from "@/actions/signout-user-action";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const signOut = async () => {
    await signOutUserAction();
    window.location.href = "/auth/signin";
  };
  return (
    <Button variant="destructive" size="sm" onClick={signOut}>
      Sign Out
    </Button>
  );
};
