import { Reservation, ReservationType, User } from "@prisma/client";
import { Request } from "express";
import { ErrorHandler, HTTP_STATUS_CODES, prisma } from "../../utils";
import { CreatreReservation, GetReservationsParams } from "./definition";
import reservationService from "./reservation.service";

const creatreReservation = async (httpRequest: any) => {
  let {
    CamionID,
    Type = "EXPORT",
    CreationDate,
    ContainerMatricule,
    Dimension,
    Imdg,
    ContainerType,
  } = httpRequest.body;
  const date = new Date(CreationDate) || new Date().toISOString();
  const { userID } = httpRequest.user;
  const reservation = await reservationService.doCheckCamionReservation(
    date,
    CamionID
  );
  if (reservation) {
    throw new ErrorHandler(
      "Selected Camion is not available for this date",
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }

  if (Type === "IMPORT") {
    let container = await prisma.container.findUnique({
      where: {
        Matricule: ContainerMatricule,
      },
    });
    if (!container) {
      throw new ErrorHandler(
        "Container Matricule not found",
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }
  }
  let reservationData: CreatreReservation = {
    CamionID,
    Date: date,
    UserID: userID,
    Type,
    ContainerMatricule,
    Dimension,
  };

  Type = (Type as ReservationType).toUpperCase();

  if (Type !== ReservationType.EXPORT && Type !== ReservationType.IMPORT) {
    throw new ErrorHandler(
      "Uknown type of reservation.",
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }

  let reservationCreated: Reservation | null = null;

  if (Type === ReservationType.EXPORT) {
    reservationData = {
      ...reservationData,
      Dimension,
      Imdg,
      ContainerType,
    };
  }

  reservationCreated = await reservationService.doCreateReservation(
    reservationData
  );

  if (reservationCreated) {
    return {
      status: HTTP_STATUS_CODES.OK,
      body: {
        success: true,
        message: "Reservation Successfully Created",
        data: reservationCreated,
      },
    };
  } else {
    throw new ErrorHandler(
      "Something went Wrong creating reservation",
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }
};

const updateReservation = async (httpRequest: Request) => {
  const { id } = httpRequest.params;
  const props = httpRequest.body;

  const reservationUpdate = await reservationService.doUpdateReservation(
    Number(id),
    props
  );

  return {
    status: HTTP_STATUS_CODES.OK,
    body: {
      success: true,
      message: "Reservation Successfully updated",
      data: reservationUpdate,
    },
  };
};

const queryReservations = async (
  httpRequest: Request & {
    user: any;
  }
) => {
  const { userID } = httpRequest.user;
  const query: GetReservationsParams = { ...httpRequest.query, userID };
  const { count, reservations } = await reservationService.doQueryReservations(
    query
  );

  return {
    status: HTTP_STATUS_CODES.OK,
    body: {
      count,
      data: reservations,
    },
  };
};

export default { creatreReservation, updateReservation, queryReservations };
