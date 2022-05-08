import { ReservationStatus, ReservationType } from "@prisma/client";

export interface CreatreReservation {
  CamionID: number;
  UserID: number;
  Date: Date;
  Type: ReservationType;
  Dimension?: string;
  Imdg?: boolean;
  ContainerMatricule: string;
  ContainerType?: string;
}

export interface UpdateReservation {
  Dimension?: string;
  Imdg?: boolean;
  ContainerMatricule: string;
  ContainerType?: string;
  Status?: ReservationStatus;
  Position?: string;
  Block?: string;
}

export interface GetReservationsParams {
  status?: ReservationStatus;
  type?: ReservationType;
  userID?: number;
  skip?: number;
  take?: number;
  isAdmin?: string;
}
