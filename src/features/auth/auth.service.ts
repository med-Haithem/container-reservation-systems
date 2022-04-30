import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUser } from "./definitions";
import {
  ErrorHandler,
  prisma,
  HTTP_STATUS_CODES,
  generateJWT,
} from "../../utils";

const { ACCESS_TOKEN_EXPIRES_IN, JWT_ACCESS_TOKEN_SECRET } = config;

const doRegister = async ({
  Email,
  Password,
  Name,
  Role = "USER",
}: RegisterUser) => {
  try {
    const user = await prisma.user.create({
      data: {
        Email: Email,
        Password: bcrypt.hashSync(Password, 10),
        Name,
        Role,
      },
    });
    // generate access token
    const payload = {
      Email,
      Name,
      userID: user.ID,
    };
    const token = await generateJWT({
      secretKey: JWT_ACCESS_TOKEN_SECRET,
      payload,
      signOption: {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    });
    return {
      access_token: token,
      ...payload,
    };
  } catch (err) {
    throw new ErrorHandler("Server Error", HTTP_STATUS_CODES.INTERNAL_SERVER);
  }
};

const doLogin = async ({
  email,
  passedPassword,
  actualPassword,
  name,
  userID,
  role,
}: any) => {
  const isValidPass = bcrypt.compareSync(passedPassword, actualPassword);
  if (!isValidPass)
    throw new ErrorHandler(
      "User with the specified email does not exist",
      HTTP_STATUS_CODES.BAD_REQUEST
    );

  // generate access token
  const payload = {
    email,
    name,
    userID,
    role,
  };

  const token = await generateJWT({
    secretKey: JWT_ACCESS_TOKEN_SECRET,
    payload,
    signOption: {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  });

  return {
    access_token: token,
    ...payload,
  };
};

const doCheckUserExist = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      Email: email,
    },
  });
  return user || null;
};

export default { doCheckUserExist, doLogin, doRegister };
