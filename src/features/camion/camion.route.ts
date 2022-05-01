import express from "express";
import {
  authGuard,
  expressCallback,
  validatorCallback,
} from "../../middlewares";
import camionController from "./camion.controller";

const camionRouter = express.Router();

camionRouter.post(
  "/",
  authGuard,
  expressCallback(camionController.createCamion)
);

camionRouter.get(
  "/",
  authGuard,
  expressCallback(camionController.queryCamions)
);

camionRouter.delete(
  "/:id",
  authGuard,
  expressCallback(camionController.deleteCamion)
);

export default camionRouter;
