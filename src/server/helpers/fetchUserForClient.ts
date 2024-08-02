import { User } from "@clerk/backend";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username ?? user.firstName,
    profileImageUrl: user.imageUrl,
    email: user.emailAddresses[0]?.emailAddress ?? null,
  };
};