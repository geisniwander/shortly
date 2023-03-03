import { db } from "../config/database.js";

export async function postUrlRepository(url, shortUrl, userId) {
  return db.query(
    `INSERT INTO urls (url, "shortUrl", "visitCount", "userId") VALUES ($1, $2, $3, $4) RETURNING id`,
    [url, shortUrl, 0, userId]
  );
}

export async function getUrlByIdRepository(id) {
  return db.query(
    `SELECT json_build_object(
        'id', urls.id,
        'shortUrl', urls."shortUrl",
        'url', urls.url
      )
      FROM urls WHERE id = $1`,
    [id]
  );
}

export async function UrlExistsRepository(shortUrl) {
  return await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);
}

export async function openUrlRepository(shortUrl) {
  await db.query(
    `UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1`,
    [shortUrl]
  );
}

export async function DeleteUrlByIdRepository(id, userId) {
  return await db.query(`DELETE FROM urls WHERE id = $1 AND "userId" = $2`, [
    id,
    userId,
  ]);
}
