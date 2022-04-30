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
        Date: date,
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

      updateReservation = {
        ...updateReservation,
        Block: container?.Block,
        Postion: container?.Postion,
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
    });

    const count = await prisma.reservation.count({ where: filterParams });
    return { reservations, count };
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

export default {
  doCreateReservation,
  doCheckCamionReservation,
  doUpdateReservation,
  doQueryReservations,
};