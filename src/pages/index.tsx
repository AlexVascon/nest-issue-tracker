import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import Dashboard from "./dashboard";

export default function Home() {
  const { data } = api.user.getAll.useQuery();
  const user = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {user.isSignedIn ? <SignOutButton /> : <SignInButton />}  
       <Dashboard/>
      </main>
    </>
  );
}
