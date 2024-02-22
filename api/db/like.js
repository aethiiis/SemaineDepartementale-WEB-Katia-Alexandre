import { BeepNotFoundError } from "../use-case/like.js";
import { pool } from "./connection-pool.js";

export async function insertLike(userId, beepId) {
  const connection = await pool.connect();
  try {
    await connection.query("BEGIN");

    await checkBeepId(connection, beepId);

    const res = await connection.query(
      "INSERT INTO liked (liker_id, beep_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, beepId]
    );

    if (res.rowCount > 0) {
      await connection.query(
        "UPDATE beep SET like_count = like_count + 1 WHERE id = $1",
        [beepId]
      );
    }

    await connection.query("COMMIT");
  } catch (e) {
    await connection.query("ROLLBACK");
    throw e;
  } finally {
    connection.release();
  }
}

export async function deleteLike(userId, beepId) {
  const connection = await pool.connect();

  try {
    await connection.query("BEGIN");

    await checkBeepId(connection, beepId);

    const res = await connection.query(
      "DELETE FROM liked WHERE liker_id = $1 AND beep_id = $2",
      [userId, beepId]
    );

    if (res.rowCount > 0) {
      await connection.query(
        "UPDATE beep SET like_count = like_count - 1 WHERE id = $1",
        [beepId]
      );
    }

    await connection.query("COMMIT");
  } catch (e) {
    await connection.query("ROLLBACK");
    throw e;
  } finally {
    connection.release();
  }
}

export async function insertResponseLike(userId, responseId) {
  const connection = await pool.connect();
  try {
    await connection.query("BEGIN");

    await checkResponseId(connection, responseId);

    const res = await connection.query(
      "INSERT INTO liked_response (liker_id, response_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, responseId]
    );

    if (res.rowCount > 0) {
      await connection.query(
        "UPDATE response SET like_count = like_count + 1 WHERE id = $1",
        [responseId]
      );
    }

    await connection.query("COMMIT");
  } catch (e) {
    await connection.query("ROLLBACK");
    throw e;
  } finally {
    connection.release();
  }
}

export async function deleteResponseLike(userId, responseId) {
  const connection = await pool.connect();

  try {
    await connection.query("BEGIN");

    await checkResponseId(connection, responseId);

    const res = await connection.query(
      "DELETE FROM liked_response WHERE liker_id = $1 AND response_id = $2",
      [userId, responseId]
    );

    if (res.rowCount > 0) {
      await connection.query(
        "UPDATE response SET like_count = like_count - 1 WHERE id = $1",
        [responseId]
      );
    }

    await connection.query("COMMIT");
  } catch (e) {
    await connection.query("ROLLBACK");
    throw e;
  } finally {
    connection.release();
  }
}

async function checkBeepId(connection, beepId) {
  const res = await connection.query("SELECT 1 FROM beep WHERE id = $1", [
    beepId,
  ]);
  if (res.rows.length === 0) {
    throw new BeepNotFoundError();
  }
}

async function checkResponseId(connection, responseId) {
  const res = await connection.query("SELECT 1 FROM response WHERE id = $1", [
    responseId,
  ]);
  if (res.rows.length === 0) {
    throw new BeepNotFoundError();
  }
}
