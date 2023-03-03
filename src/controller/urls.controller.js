import { nanoid } from "nanoid";
import { db } from "../config/database.js";

export async function postUrl(req, res) {
  const { url, userId } = res.locals.originalUrl;

  const shortUrl = nanoid(7);

  try {
    const result = await db.query(
      `INSERT INTO urls (url, "shortUrl", "visitCount", "userId") VALUES ($1, $2, $3, $4) RETURNING id`,
      [url.url, shortUrl, 0, userId]
    );

    const urlId = result.rows[0].id;

    res.status(201).send({ id: urlId, shortUrl });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT json_build_object(
        'id', urls.id,
        'shortUrl', urls."shortUrl",
        'url', urls.url
      )
      FROM urls WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) return res.sendStatus(404);

    res.status(201).send(result.rows[0].json_build_object);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function openUrl(req, res) {
  try {
    res.status(201).send("Url encontrada com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteUrlById(req, res) {
  const { sessionExists } = res.locals.data;
  const userId = sessionExists.rows[0].userId;
  const { id } = req.params;

  try {
    const urlExists = await db.query(`SELECT * FROM urls WHERE id = $1`, [id]);

    if (urlExists.rowCount === 0) return res.sendStatus(404);

    const result = await db.query(
      `DELETE FROM urls WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );

    if (result.rowCount === 0) return res.sendStatus(401);

    res.status(204).send("Url excluída com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}
