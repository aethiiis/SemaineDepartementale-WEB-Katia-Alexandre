import { queryNormalized } from "./connection-pool.js";

export async function getUsers(userName) {
  return await queryNormalized(
    `
    SELECT
      name
    FROM
      users
    WHERE
      users.name LIKE $1
    `,
    [userName + "%"]
  );
}
