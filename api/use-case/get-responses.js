import { getBeepResponses } from "../db/get-beep-response.js";

export async function getResponses(beepId, userId, Nb) {
  const responses = await getBeepResponses(beepId, userId, Nb);

  return responses;
}
