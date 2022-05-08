import { Request } from "express";
import { ErrorHandler, HTTP_STATUS_CODES } from "../../utils";
import containerService from "./container.service";
import { GetContainersParams } from "./definition";

const createContainer = async (httpRequest: any) => {
  const {
    Matricule,
    Type,
    Imdg = false,
    Position,
    Block,
    Dimension,
  } = httpRequest.body;
  const { userID } = httpRequest.user;
  try {
    const container = await containerService.doCheckContainerMatriculeExist(
      Matricule
    );
    if (container) {
      throw new ErrorHandler(
        "Container already exist!",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    const containerData = {
      Matricule,
      userID,
      Type,
      Imdg,
      Position,
      Block,
      Dimension,
    };

    const containerCreated = await containerService.DoCreateContainer(
      containerData
    );

    return {
      status: HTTP_STATUS_CODES.OK,
      body: {
        success: true,
        message: "Container Successfully Created",
        data: containerCreated,
      },
    };
  } catch {
    throw new ErrorHandler(
      "Something went wrong",
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }
};

const queryContainers = async (
  httpRequest: Request & {
    user: any;
  }
) => {
  const { userID } = httpRequest.user;
  const query: GetContainersParams = { ...httpRequest.query, userID };
  const { count, containers } = await containerService.doQueryContainers(query);

  return {
    status: HTTP_STATUS_CODES.OK,
    body: {
      count,
      data: containers,
    },
  };
};

const deleteContainer = async (httpRequest: any) => {
  const { id } = httpRequest.params;
  const isContainerDeleted = await containerService.doDeleteContainer(
    Number(id)
  );
  return {
    status: HTTP_STATUS_CODES.OK,
    body: {
      success: isContainerDeleted,
      message: "Container Successfully Deleted",
    },
  };
};

const updateContainer = async (httpRequest: Request) => {
  const { id } = httpRequest.params;
  const props = httpRequest.body;

  const containerUpdate = await containerService.doUpdateContainer(
    Number(id),
    props
  );

  return {
    status: HTTP_STATUS_CODES.OK,
    body: {
      success: true,
      message: "Container Successfully updated",
      data: containerUpdate,
    },
  };
};

export default {
  createContainer,
  deleteContainer,
  queryContainers,
  updateContainer,
};
