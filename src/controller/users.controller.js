import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import dayjs from "dayjs";
import {
  rankingRepository,
  signInRepository,
  signUpRepository,
  userExistsRepository,
  userMeRepository,
} from "../repositories/users.repository.js";

export async function signUp(req, res) {
  const { name, email, password } = res.locals.user;

  const passwordHashed = bcrypt.hashSync(password, 10);

  try {
    await signUpRepository(name, email, passwordHashed);

    return res.status(201).send("Usuário cadastrado com sucesso!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = res.locals.user;

  try {
    const userExists = await userExistsRepository(email);

    if (userExists.rowCount === 0)
      return res.status(401).send("Usuário ou senha incorretos");

    const checkPassword = bcrypt.compareSync(
      password,
      userExists.rows[0].password
    );

    if (!checkPassword)
      return res.status(401).send("Usuário ou senha incorretos");

    const token = uuidV4();
    const expireAt = dayjs().add(7, "day").format("YYYY-MM-DD");

    await signInRepository(userExists.rows[0].id, token, expireAt);

    return res.status(200).send({ token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function ranking(req, res) {
  try {
    const result = await rankingRepository();

    if (result.rowCount === 0) return res.sendStatus(404);

    return res.status(200).send(result.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function userMe(req, res) {
  const { sessionExists } = res.locals.data;
  const userId = sessionExists.rows[0].userId;

  try {
    const result = await userMeRepository(userId);

    if (result.rowCount === 0) return res.sendStatus(404);

    return res.status(200).send(result.rows[0].json_build_object);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
