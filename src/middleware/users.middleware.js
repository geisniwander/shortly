import { db } from "../config/database.js";
import { signinSchema, signupSchema } from "../schema/users.schema.js";
import { stripHtml } from "string-strip-html";
import { validateSchema } from "./validate.middleware.js";

export async function validSchemaSignup(req, res, next) {
  const user = req.body;

  await validateSchema(signupSchema, user)(req,res);

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

  return next();
}

export async function validSchemaSignin(req, res, next) {
  const user = req.body;
  
  await validateSchema(signinSchema, user)(req,res);

  const userSanitized = {
    email: stripHtml(user.email).result.trim(),
    password: stripHtml(user.password).result,
  };

  res.locals.user = { ...userSanitized };

  return next();
}
