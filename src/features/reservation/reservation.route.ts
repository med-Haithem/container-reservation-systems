import express from "express";
import {
  authGuard,
  expressCallback,
  validatorCallback,
} from "../../middlewares";
import { adminGuard } from "../../middlewares/admin";
import reservationController from "./reservation.controller";

const reservationRouter = express.Router();

reservationRouter.post(
  "/",
  authGuard,
  expressCallback(reservationController.creatreReservation),
  validatorCallback
);

reservationRouter.patch(
  "/:id",
  adminGuard,
  expressCallback(reservationController.updateReservation)
);

reservationRouter.get(
  "/",
  authGuard,
  expressCallback(reservationController.queryReservations)
);

export default reservationRouter;
