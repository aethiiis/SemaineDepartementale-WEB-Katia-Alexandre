import { queryNormalized } from "./connection-pool.js";

export async function getNbBeeps(userId) {
  return await queryNormalized(
    `
    WITH beeps AS (
      SELECT 
        beep.id 
      FROM 
        beep 
        JOIN follow ON author_id = followee 
        AND follower = $1
      UNION 
      SELECT 
        beep.id
      FROM 
        beep 
      WHERE 
        author_id = $1
    ) 
    SELECT 
      count(*)
    FROM
      beeps
    `,
    [userId]
  );
}
