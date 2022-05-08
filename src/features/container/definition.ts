export interface CreateContainer {
  Matricule: string;
  Type: string;
  Imdg: boolean;
  Position: string;
  Block: string;
  userID?: number;
}

export interface GetContainersParams {
  skip?: number;
  take?: number;
  userID: number;
}

export interface UpdateContainer {
  Matricule: string;
  Type: string;
  Imdg: boolean;
  Position: string;
  Block: string;
  Dimension: string;
}
