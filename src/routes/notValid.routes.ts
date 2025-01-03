import { Application, NextFunction, Request, Response } from "express";
import { CommonRoutes } from "../common/commonRoutes";

export class NotValidRoutes extends CommonRoutes {

  constructor(app: Application) {

    super(app, "Not Valid route", "0.0.1");
  }

  public override configureRoute(): Application {

    this.app.all("*", async (req: Request, _res: Response, next: NextFunction) => {
      const err = new Error(`Route ${req.originalUrl} not found`) as Error & {
        statusCode: number;
      };
      err.statusCode = 404;
      next(err);
    });

    this.app.use(
      (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        const isNonNullObject = typeof err === "object" && err !== null;

        const status =
          isNonNullObject && "status" in err ? err.status : "error";
        const statusCode =
          isNonNullObject && "statusCode" in err
            ? isNaN(Number(err.statusCode))
              ? 500
              : (err.statusCode as number)
            : 500;

        const message = isNonNullObject && "message" in err ? err.message : "";

        res.status(statusCode).json({
          status,
          message,
        });
      }
    );

    return this.getApp();
  }
}