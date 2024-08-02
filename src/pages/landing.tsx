import { NextPage } from "next";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

const Landing: NextPage = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const login = api.user.login.useMutation();

  useEffect(() => {
    const performLogin = async () => {
      if (!isLoaded) {
        router.push("/landing");
      } else if (user) {
        const { username, firstName, imageUrl } = user;

        try {
          await login.mutateAsync({
            username: username ?? firstName ?? "",
            img_url: imageUrl,
          });
          router.push("/dashboard");
        } catch (error) {
          console.error("Error occurred during login:", error);
        }
      }
    };

    performLogin();
  }, [isLoaded, user, router, login]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4">
      <p>
        This is a full stack issue tracker application, connected to a prisma
        database. It requires user credendtials to access. It has the option for
        github or gmail.{" "}
      </p>
      <SignInButton />
    </div>
  );
};

export default Landing;
