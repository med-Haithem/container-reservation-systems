export interface CreatreCamion {
  matricule: string;
  userID: number;
}
export interface GetCamionsParams {
  skip?: number;
  take?: number;
  userID: number;
}
