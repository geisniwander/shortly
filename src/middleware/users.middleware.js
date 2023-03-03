import { db } from "../config/database.js";
import { signinSchema, signupSchema } from "../schema/users.schema.js";
import { stripHtml } from "string-strip-html";

export async function validSchemaSignup(req, res, next) {
  const user = req.body;

  const { error } = signupSchema.validate(user);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send({ errors });
  }

  const userSanitized = {
    name: stripHtml(user.name).result.trim(),
    email: stripHtml(user.email).result.trim(),
    password: stripHtml(user.password).result,
    confirmPassword: stripHtml(user.confirmPassword).result,
  };

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
  const user = req.body;

  const { error } = signinSchema.validate(user);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send({ errors });
  }

  const userSanitized = {
    email: stripHtml(user.email).result.trim(),
    password: stripHtml(user.password).result,
  };

  res.locals.user = { ...userSanitized };

  return next();
}
