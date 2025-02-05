// import { Providers } from "@/components/ui/providers";
import { SessionProvider } from "next-auth/react";
import ProfileWrap from "./_components/profilewrap";
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // return <ProfileWrap>{children}</ProfileWrap>;
  return (
    // <Providers>
    <SessionProvider>
      <ProfileWrap>{children}</ProfileWrap>
    </SessionProvider>
    // </Providers>
  );
}
