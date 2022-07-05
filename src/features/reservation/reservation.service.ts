import { ErrorHandler, HTTP_STATUS_CODES, prisma } from "../../utils";
import {
  CreatreReservation,
  GetReservationsParams,
  UpdateReservation,
} from "./definition";

const doCreateReservation = async (reservationPayload: CreatreReservation) => {
  try {
    const reservation = await prisma.reservation.create({
      data: reservationPayload,
    });
    return reservation;
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doCheckCamionReservation = async (date: Date, camionID: number) => {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        Date: { gte: date, lte: new Date(date.getTime() + 60 * 60000) },
        CamionID: camionID,
      },
    });
    return reservation;
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doUpdateReservation = async (
  id: number,
  updateReservation: UpdateReservation
) => {
  try {
    const validReservation = await prisma.reservation.findUnique({
      where: {
        ID: id,
      },
    });
    if (!validReservation) {
      throw new ErrorHandler("ID not found", HTTP_STATUS_CODES.NOT_FOUND);
    }
    if (
      updateReservation.Status === "RESOLVED" &&
      validReservation.Type === "IMPORT"
    ) {
      let container = await prisma.container.findUnique({
        where: {
          Matricule: validReservation.ContainerMatricule,
        },
      });
      if (!validReservation) {
        throw new ErrorHandler(
          "Containter Matricule not found",
          HTTP_STATUS_CODES.NOT_FOUND
        );
      }
      updateReservation = {
        ...updateReservation,
        Block: container?.Block,
        Position: container?.Position,
      };
    }

    const reservation = await prisma.reservation.update({
      data: updateReservation,
      where: {
        ID: id,
      },
    });

    return reservation;
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doQueryReservations = async (params: GetReservationsParams) => {
  try {
    const filterParams = {
      UserID: params.userID,
      Status: params.status,
      Type: params.type,
    };

    if (params.isAdmin && params.isAdmin.toLowerCase() === "true") {
      delete filterParams.UserID;
    }

    let { skip, take } = params;
    const paginationConfig: {
      skip?: number;
      take?: number;
    } = {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    };

    const reservations = await prisma.reservation.findMany({
      where: filterParams,
      ...paginationConfig,
      orderBy: { ID: "desc" },
    });

    const count = await prisma.reservation.count({ where: filterParams });
    return { reservations, count };
  } catch (err) {
    console.log("err");
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

export default {
  doCreateReservation,
  doCheckCamionReservation,
  doUpdateReservation,
  doQueryReservations,
};
