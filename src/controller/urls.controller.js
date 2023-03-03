import { nanoid } from "nanoid";
import {
  deleteUrlByIdRepository,
  getUrlByIdRepository,
  openUrlRepository,
  postUrlRepository,
  urlExistsByIdRepository,
  urlExistsRepository,
} from "../repositories/urls.repository.js";

export async function postUrl(req, res) {
  const { url, userId } = res.locals.originalUrl;
  const urlString = url.url;
  const shortUrl = nanoid(7);

  try {
    const result = await postUrlRepository(urlString, shortUrl, userId);

    const urlId = result.rows[0].id;

    return res.status(201).send({ id: urlId, shortUrl });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const result = await getUrlByIdRepository(id);

    if (result.rowCount === 0) return res.sendStatus(404);

    return res.status(200).send(result.rows[0].json_build_object);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function openUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const urlExists = await urlExistsRepository(shortUrl);

    if (urlExists.rowCount === 0) return res.sendStatus(404);

    await openUrlRepository(shortUrl);

    const originalUrl = urlExists.rows[0].url;

    return res.redirect(originalUrl);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function deleteUrlById(req, res) {
  const { sessionExists } = res.locals.data;
  const userId = sessionExists.rows[0].userId;
  const { id } = req.params;

  try {
    const urlExists = await urlExistsByIdRepository(id);

    if (urlExists.rowCount === 0) return res.sendStatus(404);

    const result = await deleteUrlByIdRepository(id, userId);

    if (result.rowCount === 0) return res.sendStatus(401);

    return res.status(204).send("Url excluída com sucesso!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
