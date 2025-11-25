import fs from "fs";
import path from "path";
import morgan from "morgan";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(
  path.join(logDir, "access.log"),
  { flags: "a" }
);

morgan.token("user-id", (req) => req.user?.uid || "anon");
morgan.token("user-email", (req) => req.user?.email || "anon");

const protectedFormat =
  ':date[iso] :method :url :status :response-time ms user=:user-id email=:user-email';

export const requestLogger = morgan(protectedFormat, { stream: accessLogStream });
