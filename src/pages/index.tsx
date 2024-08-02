import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const login = api.user.login.useMutation();

  useEffect(() => {
    const performLogin = async () => {
      if (!isLoaded) {
        void router.push("/landing");
      } else if (user) {
        const { username, firstName, imageUrl } = user;

        try {
          await login.mutateAsync({
            username: username ?? firstName ?? "",
            img_url: imageUrl,
          });
          void router.push("/dashboard");
        } catch (error) {
          console.error("Error occurred during login:", error);
        }
      }
    };

    void performLogin();
  }, [isLoaded, user, router, login]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <main className="apple flex min-h-screen flex-col items-center justify-center">
        {!isLoaded && <LoadingSpinner />}
      </main>
    </>
  );
};

export default Home;
