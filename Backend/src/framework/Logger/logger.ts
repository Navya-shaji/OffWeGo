import fs from "fs";
import path from "path";
import morgan, { StreamOptions } from "morgan";

const logDirectory = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

export const morganFileLogger = morgan("combined", { stream: accessLogStream });

export const morganConsoleLogger = morgan("dev");
