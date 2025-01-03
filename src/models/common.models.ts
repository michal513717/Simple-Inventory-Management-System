import * as http from "http";
import { Application } from "express";

export type HttpServer = http.Server;
export type NextFunction = () => void;
export type CommonRoutesInitData = {
  app: Application;
  routeName: string;
  version: string;
};