import { nanoid } from "nanoid";
import { db } from "../config/database.js";

export async function postUrl(req, res) {
  const { url, userId } = res.locals.originalUrl;

  const shortUrl = nanoid(7);

  try {
    const result = await db.query(
      `INSERT INTO urls (url, "shortUrl", "visitCount", "userId") VALUES ($1, $2, $3, $4) RETURNING id`,
      [url, shortUrl, 0, userId]
    );

    const urlId = result.rows[0].id;

    res.status(201).send({ id: urlId, shortUrl });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getUrlById(req, res) {
  try {
    res.status(201).send("Url encontrada com sucesso!");
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
  try {
    res.status(201).send("Url excluída com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}
