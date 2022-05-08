import express from "express";
import {
  authGuard,
  expressCallback,
  validatorCallback,
} from "../../middlewares";
import { adminGuard } from "../../middlewares/admin";
import containerController from "./container.controller";

const containerRouter = express.Router();

containerRouter.post(
  "/",
  adminGuard,
  expressCallback(containerController.createContainer),
  validatorCallback
);

containerRouter.patch(
  "/:id",
  adminGuard,
  expressCallback(containerController.updateContainer)
);

containerRouter.get(
  "/",
  authGuard,
  expressCallback(containerController.queryContainers)
);

containerRouter.delete(
  "/:id",
  adminGuard,
  expressCallback(containerController.deleteContainer)
);
export default containerRouter;
