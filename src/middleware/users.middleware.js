import { db } from "../configs/database.js";
import { userSchema } from "../schema/users.schema.js";

export async function validSchemaUser(req, res, next) {
  const {name, email, password, confirmPassword} = req.body;
  
  const userSanitized = {
    name: stripHtml(name).result.trim(),
    email: stripHtml(email).result.trim(),
    password: stripHtml(password).result,
    confirmPassword: stripHtml(confirmPassword).result,
  };

  const { error } = userSchema.validate(userSanitized);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send({ errors });
  }

  const emailExists = await db.query("SELECT * FROM users WHERE email=$1", [
    userSanitized.email,
  ]);

  if (emailExists.rowCount !== 0) {
    return res.status(409).send("Este email já está em uso!");
  }

  res.locals.user = { ...userSanitized };

  next();
}
