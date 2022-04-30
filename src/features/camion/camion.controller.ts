import { Request } from "express";
import { ErrorHandler, HTTP_STATUS_CODES } from "../../utils";
import camionService from "./camion.service";
import { GetCamionsParams } from "./definition";

const createCamion = async (httpRequest: any) => {
  const { Matricule } = httpRequest.body;
  const { userID } = httpRequest.user;
  try {
    const camion = await camionService.doCheckCamionMatriculeExist(Matricule);
    if (camion) {
      throw new ErrorHandler(
        "Camion already exist!",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    const camionData = {
      matricule: Matricule,
      userID,
    };

    const camionCreated = await camionService.DoCreateCamion(camionData);

    return {
      status: HTTP_STATUS_CODES.OK,
      body: {
        success: true,
        message: "Camion Successfully Created",
        data: camionCreated,
      },
    };
  } catch {
    throw new ErrorHandler(
      "Something went wrong",
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }
};

const queryCamions = async (
  httpRequest: Request & {
    user: any;
  }
) => {
  const { userID } = httpRequest.user;
  const query: GetCamionsParams = { ...httpRequest.query, userID };
  const { count, camions } = await camionService.doQueryCamions(query);

  return {
    status: HTTP_STATUS_CODES.OK,
    body: {
      count,
      data: camions,
    },
  };
};

const deleteCamion = async (httpRequest: any) => {
  const { id } = httpRequest.params;
  const isCamionDeleted = await camionService.doDeleteCamion(Number(id));
  return {
    status: HTTP_STATUS_CODES.OK,
    body: {
      success: isCamionDeleted,
      message: "Camion Successfully Deleted",
    },
  };
};

export default { createCamion, deleteCamion, queryCamions };
