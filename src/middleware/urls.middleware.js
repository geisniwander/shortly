import { urlSchema } from "../schema/urls.schema.js";
import { validateSchema } from "./validate.middleware.js";

export async function validSchemaUrl(req, res, next) {
  const url = req.body;
  const { sessionExists } = res.locals.data;

  await validateSchema(urlSchema, url)(req,res);

  const userId = sessionExists.rows[0].userId;

  if (!userId) {
    return res.sendStatus(401);
  }

  res.locals.originalUrl = { url, userId };

  return next();
}
