import express from "express";
import cors from "cors";
import { handleError, validateJson } from "./middlewares";
import { getRoutes } from "./loaders/routes";

const app = express();

// enable cors
app.use(cors());

// parse json body
app.use(express.json());

// handle bad json format
app.use(validateJson);

// load routes
getRoutes(app);

// catch all errors

app.use(handleError);

export default app;
