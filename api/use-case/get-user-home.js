import { getHomeBeeps } from "../db/get-home-beeps.js";

export async function getUserHome(userId, Nb) {
  const beeps = await getHomeBeeps(userId, Nb);

  return beeps;
}
