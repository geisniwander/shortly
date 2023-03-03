import express from "express";
import cors from "cors";
import userRouter from "./routes/users.routes.js";


const server = express();

server.use(express.json());
server.use(cors());

server.use([userRouter]); 

server.listen(5000, () => {
  console.log("Server running on port 5000");
});