import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";


const NavBar = () => {
  return (
    <div id="navbar">
      <SignOutButton>
        <button id="sign-out">Sign out</button>
      </SignOutButton>
    </div>
  );
}

export default NavBar;
