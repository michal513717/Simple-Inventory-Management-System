import { Application } from "express";

export class Debugger {

  public static debugRequest = async (application: Application) => {

    application.use((req, res, next) => {
      console.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

      res.on('finish', () => {
        console.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
      });

      next();
    });
  }
}