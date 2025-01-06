import * as log4js from "log4js";

export const configureLogger = () => {
    log4js.configure({
        appenders: { out: { type: "stdout" }, file: { type: "file", filename: "logs/app.log" } },
        categories: {
            default: { appenders: ["out", "file"], level: "debug" },
            Main: { appenders: ["out", "file"], level: "info" },
            Http: { appenders: ["out", "file"], level: "info" },
            Database: { appenders: ["out", "file"], level: "debug" }
        },
    });
}
