import { queryNormalized } from "./connection-pool.js";

export async function getUserBeeps(activeUserId, viewedUserId, Nb) {
  return await queryNormalized(
    `SELECT 
      beep.id, 
      beep.content, 
      beep.created_at, 
      beep.like_count,
      users.id AS author_id, 
      users.name AS author_name,
      users.picture AS author_picture,
      liked.id IS NOT NULL AS "liked"
    FROM 
      beep 
      JOIN users ON beep.author_id = users.id
      LEFT JOIN liked ON liked.liker_id = $2 AND liked.beep_id = beep.id
    WHERE 
      author_id = $1 
    ORDER BY 
      created_at DESC 
    LIMIT 
      $3`,
    [viewedUserId, activeUserId, Nb]
  );
}
