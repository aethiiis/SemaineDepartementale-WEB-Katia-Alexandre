import { queryNormalized } from "./connection-pool.js";

export async function getHomeBeeps(userId, Nb) {
  return await queryNormalized(
    `
    WITH home_beep AS (
      SELECT 
        beep.id, 
        author_id, 
        created_at, 
        content, 
        like_count 
      FROM 
        beep 
        JOIN follow ON author_id = followee 
        AND follower = $1 
      UNION 
      SELECT 
        beep.id, 
        author_id, 
        created_at, 
        content, 
        like_count 
      FROM 
        beep 
      WHERE 
        author_id = $1
    ) 
    SELECT 
      home_beep.id, 
      home_beep.content, 
      home_beep.created_at, 
      home_beep.like_count, 
      users.id AS author_id, 
      users.name AS author_name, 
      users.picture AS author_picture, 
      liked.id IS NOT NULL AS "liked" 
    FROM 
      home_beep 
      JOIN users ON home_beep.author_id = users.id 
      LEFT JOIN liked ON liked.liker_id = $1
      AND liked.beep_id = home_beep.id 
    ORDER BY 
      created_at DESC 
    LIMIT 
      $2
    `,
    [userId, Nb]
  );
}
