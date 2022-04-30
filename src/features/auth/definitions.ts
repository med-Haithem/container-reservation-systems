import { Role } from "@prisma/client";

export interface RegisterUser {
  Email: string;
  Password: string;
  Name: string | null;
  Role: Role;
}
