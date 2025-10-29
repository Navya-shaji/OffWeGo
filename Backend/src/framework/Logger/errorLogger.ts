import fs from "fs";
import path from "path";

const logDirectory = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const errorLogPath = path.join(logDirectory, "error.log");

interface LoggableError {
  message: string;
  stack?: string;
  statusCode?: number;
  path?: string;
  method?: string;
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

export const logErrorToFile = (error: LoggableError): void => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${JSON.stringify(error, null, 2)}\n`;

  fs.appendFileSync(errorLogPath, logMessage, "utf8");
};
