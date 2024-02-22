import { doesUserFollow } from "../db/follows.js";
import { getUserBeeps } from "../db/get-user-beeps.js";
import { getUserByName } from "../db/user.js";

export class UsernameNotFound extends Error {}

export async function getUserPageByName(requesterId, name, Nb) {
  const viewedUser = await getUserByName(name);

  if (viewedUser === null) {
    throw new UsernameNotFound();
  }

  const beeps = await getUserBeeps(requesterId, viewedUser.id, Nb);

  const followed = await doesUserFollow(requesterId, viewedUser.id);

  return { viewedUser, beeps, followed };
}
