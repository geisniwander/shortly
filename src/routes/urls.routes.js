import { Router } from "express";
import {
  deleteUrlById,
  getUrlById,
  openUrl,
  postUrl,
} from "../controller/urls.controller.js";
import { validSchemaUrl } from "../middleware/urls.middleware.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validSchemaUrl, postUrl);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl", openUrl);
urlRouter.delete("/urls/:id", deleteUrlById);

export default urlRouter;
