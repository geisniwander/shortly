import express from "express";
import cors from "cors";
import userRouter from "./routes/users.routes.js";
import urlRouter from "./routes/urls.routes.js";

const server = express();

server.use(express.json());
server.use(cors());

server.use([userRouter, urlRouter]);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running in port: ${port}`);
});
