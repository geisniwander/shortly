import {db} from "../config/database.js";
import dayjs from "dayjs";

export async function authValidation(req, res, next) {
  const url = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  console.log(authorization)
  if (!token) return res.status(422).send("Informe o token!");
    
  const date = dayjs().format("YYYY-MM-DD");
  
  try {
    const sessionExists = await db.query(
        `
        SELECT * FROM sessions WHERE token = $1 AND "expireAt" > $2;
        `,
        [token, date]
      );

    if (sessionExists.rowCount === 0)
      return res
        .status(401)
        .send("Você não tem autorização para acessar este recurso ou sua sessão expirou, faça login novamente!");

    res.locals.data = {sessionExists, url};

    next();
  } catch (error) {
    res.status(500).send(error);
  }
}