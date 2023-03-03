import { db } from "../configs/database.js";
import { userSchema } from "../schema/users.schema.js";

export async function validSchemaUser(req, res, next) {
  const user = req.body;

  const { error } = userSchema.validate(user);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send({ errors });
  }

  const emailExists = await db.query("SELECT * FROM users WHERE email=$1", [
    user.email,
  ]);

  if (emailExists.rowCount !== 0) {
    return res.sendStatus(409);
  }

  res.locals.user = { ...user };

  next();
}
