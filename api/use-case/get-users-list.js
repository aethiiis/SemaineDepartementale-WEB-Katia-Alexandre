import { getUsers } from "../db/get-users-list.js";

export async function getUsersList(userName) {
  const users = await getUsers(userName);
  return users;
}
