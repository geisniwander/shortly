import { urlSchema } from "../schema/urls.schema.js";

export async function validSchemaUrl(req, res, next) {
  const url = req.body;
  const { sessionExists } = res.locals.data;
  const { error } = urlSchema.validate(url);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send({ errors });
  }

  const userId = sessionExists.rows[0].userId;

  if (!userId) {
    return res.sendStatus(401);
  }

  res.locals.originalUrl = { url, userId };

  return next();
}
