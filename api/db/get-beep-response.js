import { queryNormalized } from "./connection-pool.js";

export async function getBeepResponses(beepId, userId, Nb) {
  return await queryNormalized(
    `
      WITH rebeep AS (
        SELECT 
            response.id, 
            author_id, 
            created_at, 
            content, 
            like_count,
            beep_id
        FROM
            response
        WHERE
            beep_id = $1
        ORDER BY 
          created_at DESC
      ) 
      SELECT 
        rebeep.id, 
        rebeep.content, 
        rebeep.created_at, 
        rebeep.like_count,
        rebeep.beep_id,
        users.id AS author_id, 
        users.name AS author_name, 
        users.picture AS author_picture, 
        liked_response.id IS NOT NULL AS "liked"
      FROM 
        rebeep 
        JOIN users ON rebeep.author_id = users.id 
        LEFT JOIN liked_response ON liked_response.liker_id = $2
        AND liked_response.response_id = rebeep.id 
      ORDER BY 
        created_at DESC 
      LIMIT 
        $3
    `,
    [beepId, userId, Nb]
  );
}
