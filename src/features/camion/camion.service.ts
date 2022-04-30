import { ErrorHandler, HTTP_STATUS_CODES, prisma } from "../../utils";
import { CreatreCamion, GetCamionsParams } from "./definition";

const DoCreateCamion = async ({ matricule, userID }: CreatreCamion) => {
  try {
    const camion = await prisma.camion.create({
      data: {
        matricule,
        userID,
      },
    });
    return camion;
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doDeleteCamion = async (camionID: number) => {
  try {
    const camionDeleted = await prisma.camion.delete({
      where: { ID: camionID },
    });
    return camionDeleted != null;
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doQueryCamions = async (params: GetCamionsParams) => {
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

    const camions = await prisma.camion.findMany({
      where: whereQuery,
      ...paginationConfig,
    });
    const count = await prisma.camion.count({ where: whereQuery });
    return { camions, count };
  } catch (err) {
    console.log("err", err);
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doCheckCamionMatriculeExist = async (matricule: string) => {
  const camion = await prisma.camion.findUnique({
    where: {
      matricule,
    },
  });
  return camion || null;
};

export default {
  DoCreateCamion,
  doCheckCamionMatriculeExist,
  doDeleteCamion,
  doQueryCamions,
};
