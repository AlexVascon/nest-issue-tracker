import { User } from "@clerk/backend";
export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.imageUrl,
    externalUsername: user.externalAccounts.find((externalAccount) => externalAccount.provider === "oauth_github")?.username || null
  };
};