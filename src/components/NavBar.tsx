import Link from "next/link";
import { Button } from "src/components/ui/button";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

const NavBar = () => {
  const { user } = useUser();
  return (
    <div className="flex h-12 items-center px-4 ">
      {user && (
        <>
          <Link
            className="inline-flex items-center space-x-2 text-sm font-medium"
            href="/dashboard"
          >
            <PackageIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <SignOutButton>
              <Button size="sm" variant="outline" className="border-none">
                Sign out
              </Button>
            </SignOutButton>
            {user && (
              <Image
                src={user.imageUrl ?? ""}
                width={10}
                height={10}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

function PackageIcon(props: Record<string, unknown>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function UserIcon(props: Record<string, unknown>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default NavBar;
