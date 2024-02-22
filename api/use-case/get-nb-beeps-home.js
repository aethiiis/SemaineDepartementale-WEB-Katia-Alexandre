import { getNbBeeps } from "../db/get-nb-beeps.js";

export async function getNbBeepsHome(userId) {
  const beeps = await getNbBeeps(userId);

  return beeps;
}
