import { Request } from "express";
import authService from "./auth.service";

import { ErrorHandler, HTTP_STATUS_CODES } from "../../utils";

const { doCheckUserExist, doLogin, doRegister } = authService;

const login = async (httpRequest: Request) => {
  const { Email, Password } = httpRequest.body;
  try {
    const userData = await doCheckUserExist(Email);
    if (!userData) {
      throw new ErrorHandler(
        "User does not exist!",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    const loginData = {
      email: Email,
      passedPassword: Password,
      actualPassword: userData?.Password,
      name: userData?.Name,
      userID: userData.ID,
      role: userData.Role,
    };
    const loginResult = await doLogin(loginData);

    return {
      status: HTTP_STATUS_CODES.OK,
      body: {
        success: true,
        message: "Successfully logged in!",
        data: loginResult,
      },
    };
  } catch (err) {
    throw new ErrorHandler(
      "User does not  exist!",
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }
};

const register = async (httpRequest: Request) => {
  const { Email, Password, Name, Role } = httpRequest.body;
  try {
    const user = await doCheckUserExist(Email);
    console.log("user", user);

    if (user) {
      throw new ErrorHandler(
        "User already exist!",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    const registerResult = await doRegister({ Email, Password, Name, Role });
    return {
      status: HTTP_STATUS_CODES.OK,
      body: {
        success: true,
        message: "Registered successfully!",
        data: registerResult,
      },
    };
  } catch (err) {
    console.log("err", err);

    throw new ErrorHandler(
      "User already exist!",
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }
};

const userInfo = async (httpRequest: any) => {
  const { email } = httpRequest.user;

  try {
    const user = await doCheckUserExist(email);
    if (!user) {
      throw new ErrorHandler(
        "User doesn't exist",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    const { Email, Name } = user;
    return {
      status: HTTP_STATUS_CODES.OK,
      body: {
        success: true,
        user: { Email, Name },
      },
    };
  } catch (err) {
    throw new ErrorHandler(
      "Something went wrong!",
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }
};

export default { login, register, userInfo };
