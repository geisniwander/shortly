import { db } from "../config/database.js";

export async function signUpRepository(name, email, passwordHashed) {
  return db.query(
    `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3);
    `,
    [name, email, passwordHashed]
  );
}

export async function userExistsRepository(email) {
  return db.query(
    `
      SELECT * FROM users WHERE email = $1 ;
      `,
    [email]
  );
}

export async function signInRepository(userId, token, expireAt) {
  await db.query(`DELETE FROM sessions WHERE "userId" = $1`, [userId]);

  await db.query(
    `
        INSERT INTO sessions ("userId", token, "expireAt") 
        VALUES ($1, $2, $3);
        `,
    [userId, token, expireAt]
  );
}

export async function rankingRepository() {
  return db.query(`SELECT users.id, users.name, COUNT(DISTINCT urls.id) AS "linksCount", 
    SUM(urls."visitCount") AS "visitCount" 
    FROM users 
    JOIN urls
      ON urls."userId"=users.id
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10;
    `);
}

export async function userMeRepository(userId) {
  return db.query(
    `
    SELECT json_build_object(
      'id', users.id,
      'name', users.name,
      'visitCount', SUM(urls."visitCount"),
      'shortenedUrls', json_agg(
        json_build_object(
          'id', urls.id,
          'shortUrl', urls."shortUrl",
          'url', urls.url,
          'visitCount', urls."visitCount"
        )
      )
    )
    FROM users
    JOIN urls ON urls."userId" = users.id
    WHERE users.id = $1
    GROUP BY users.id;
  `,
    [userId]
  );
}
