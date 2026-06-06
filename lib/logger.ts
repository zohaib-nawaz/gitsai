type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_PREFIX = "gitsai";

function isLoggingEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

function writeLog(
  level: LogLevel,
  scope: string,
  message: string,
  ...args: unknown[]
): void {
  if (!isLoggingEnabled()) {
    return;
  }

  const label = `[${LOG_PREFIX}:${scope}]`;
  const payload = args.length > 0 ? args : undefined;

  switch (level) {
    case "error":
      console.error(label, message, ...(payload ?? []));
      break;
    case "warn":
      console.warn(label, message, ...(payload ?? []));
      break;
    case "debug":
      console.debug(label, message, ...(payload ?? []));
      break;
    default:
      console.info(label, message, ...(payload ?? []));
  }
}

export interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

export function createLogger(scope: string): Logger {
  return {
    debug: (message, ...args) => writeLog("debug", scope, message, ...args),
    info: (message, ...args) => writeLog("info", scope, message, ...args),
    warn: (message, ...args) => writeLog("warn", scope, message, ...args),
    error: (message, ...args) => writeLog("error", scope, message, ...args),
  };
}

/** Default app-wide logger. Disabled in production. */
export const logger = createLogger("app");
