import Link from "next/link";
import { Button } from "@/components/ui/button";

export const NavBar = () => {
  return (
    <nav className="h-14 border-b">
      <div className="container flex h-full min-w-full items-center justify-between px-4">
        <h3 className="text-xl font-semibold tracking-tight">
          <Link href="/">MediScribe</Link>
        </h3>
        <ul className="flex items-center gap-x-4">
          <li>
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </li>
          <li>
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
