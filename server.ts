import http from "http";
import express, { Express } from "express";
import app from "./src/app";

const PORT = process.env.PORT || 3175;

const httpServer = http.createServer(app);

httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);