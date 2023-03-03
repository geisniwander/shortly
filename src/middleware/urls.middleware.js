import { db } from "../config/database.js";
import { urlSchema } from "../schema/urls.schema.js";
import dayjs from "dayjs";

export async function validSchemaUrl(req, res, next) {
  const { sessionExists, url } = res.locals.data;

  const { error } = urlSchema.validate(url);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send({ errors });
  }

  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const date = dayjs().format("YYYY-MM-DD");

  const userId = await db.query(
    'SELECT "userId" FROM sessions WHERE token=$1 AND "expireAt" < $2',
    [token, date]
  );

  if (!userId) {
    return res.sendStatus(401);
  }

  res.locals.originalUrl = { url, userId };

  next();
}
