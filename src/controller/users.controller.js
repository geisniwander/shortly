import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { db } from "../config/database.js";
import dayjs from "dayjs";

export async function signUp(req, res) {
  const { name, email, password } = res.locals.user;

  const passwordHashed = bcrypt.hashSync(password, 10);

  try {
    await db.query(
      `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3);
    `,
      [name, email, passwordHashed]
    );

    res.status(201).send("Usuário cadastrado com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = res.locals.user;

  try {
    const userExists = await db.query(
      `
      SELECT * FROM users WHERE email = $1 ;
      `,
      [email]
    );

    if (userExists.rowCount === 0)
      return res.status(400).send("Usuário ou senha incorretos");

    const checkPassword = bcrypt.compareSync(
      password,
      userExists.rows[0].password
    );

    if (!checkPassword)
      return res.status(400).send("Usuário ou senha incorretos");

    const token = uuidV4();
    const expireAt = dayjs().add(7, "day").format("YYYY-MM-DD");

    await db.query(
      `
      INSERT INTO sessions ("userId", token, "expireAt") 
      VALUES ($1, $2, $3);
      `,
      [userExists.rows[0].id, token, expireAt]
    );

    return res.status(200).send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function ranking(req, res) {

  try {

    const result = await db.query(`SELECT users.id, users.name, COUNT(DISTINCT urls.id) AS "linksCount", 
    SUM(urls."visitCount") AS "visitCount" 
    FROM users 
    JOIN urls
      ON urls."userId"=users.id
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10;
    `
    );

    if (result.rowCount === 0) return res.sendStatus(404);

    res.status(201).send(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}