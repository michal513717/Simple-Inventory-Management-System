import type { Application } from "express";
import { CommonRoutesInitData } from "../models/common.models";

export abstract class CommonRoutes {
    private routeName: string;
    private version: string;
    protected app: Application;
  
    public static statusMessage = {
      FAILED: "Failed",
      SUCCESS: "Success",
    };
  
    protected static routeType = {
      PUT: "PutRoutes",
      GET: "GetRoutes",
      POST: "PostRoutes",
      PATCH: "PatchRoutes",
      DELETE: "DeleteRoutes",
      SOCKET: "SocketRoutes",
      NOT_VALID: "NotValidRoutes",
    };
  
    constructor(app: Application, routeName: string, version: string) {
      this.routeName = routeName;
      this.app = app;
      this.version = version;
  
      this.init({
        app,
        routeName,
        version
      });
  
      this.configureRoutes();
    }
  
    //To implements methods before configure routes
    protected init(initData: CommonRoutesInitData): void{}
  
    public getName(): string {
      return this.routeName;
    }
  
    public getVersion(): string {
      return this.version;
    }
  
    public getApp(): Application {
      return this.app;
    }
  
    abstract configureRoutes(): Application;
}