import { db } from "../configs/database.js";
import { signinSchema, signupSchema } from "../schema/users.schema.js";

export async function validSchemaSignup(req, res, next) {
  const { name, email, password, confirmPassword } = req.body;

  const userSanitized = {
    name: stripHtml(name).result.trim(),
    email: stripHtml(email).result.trim(),
    password: stripHtml(password).result,
    confirmPassword: stripHtml(confirmPassword).result,
  };

  const { error } = signupSchema.validate(userSanitized);

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

export async function validSchemaSignin(req, res, next) {
  const { email, password } = req.body;

  const userSanitized = {
    email: stripHtml(email).result.trim(),
    password: stripHtml(password).result,
  };

  const { error } = signinSchema.validate(userSanitized);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send({ errors });
  }

  res.locals.user = { ...userSanitized };

  next();
}
