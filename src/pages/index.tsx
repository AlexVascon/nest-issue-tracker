import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import type { NextPage } from "next";
import Dashboard from "./dashboard";

const Home: NextPage = () => {
  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <SignInButton afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
      </main>
    </>
  );
};

export default Home;
