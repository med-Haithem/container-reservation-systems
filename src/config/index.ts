import dotenv from "dotenv";
dotenv.config();

export default {
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  PORT: process.env.PORT,
  CURRENCY_CONVERTER_BASE_API:
    process.env.CURRENCY_CONVERTER_BASE_API || "http://data.fixer.io/api/",
  FIXER_API_ACCESS: process.env.FIXER_API_ACCESS,
};
