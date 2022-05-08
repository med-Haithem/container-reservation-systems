import { ErrorHandler, HTTP_STATUS_CODES, prisma } from "../../utils";
import {
  CreateContainer,
  GetContainersParams,
  UpdateContainer,
} from "./definition";

const DoCreateContainer = async (createContainer: CreateContainer) => {
  try {
    const container = await prisma.container.create({
      data: createContainer,
    });
    return container;
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doDeleteContainer = async (containerID: number) => {
  try {
    const containerDeleted = await prisma.container.delete({
      where: { ID: containerID },
    });
    return containerDeleted != null;
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doQueryContainers = async (params: GetContainersParams) => {
  try {
    const whereQuery = {
      userID: params.userID,
    };
    let { skip, take } = params;

    const paginationConfig: {
      skip?: number;
      take?: number;
    } = {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    };

    const containers = await prisma.container.findMany({
      ...paginationConfig,
    });
    const count = await prisma.container.count({ where: whereQuery });
    return { containers, count };
  } catch (err) {
    console.log("err", err);
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doCheckContainerMatriculeExist = async (Matricule: string) => {
  const container = await prisma.container.findUnique({
    where: {
      Matricule,
    },
  });
  return container || null;
};

const doUpdateContainer = async (
  id: number,
  updateContainer: UpdateContainer
) => {
  try {
    const validContainer = await prisma.container.findUnique({
      where: {
        ID: id,
      },
    });
    if (!validContainer) {
      throw new ErrorHandler("ID not found", HTTP_STATUS_CODES.NOT_FOUND);
    }

    const container = await prisma.container.update({
      data: updateContainer,
      where: {
        ID: id,
      },
    });

    return container;
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

export default {
  DoCreateContainer,
  doCheckContainerMatriculeExist,
  doDeleteContainer,
  doQueryContainers,
  doUpdateContainer,
};
