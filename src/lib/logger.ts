export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStructured: boolean;
}

const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableStructured: process.env.NODE_ENV === "production",
};

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatMessage(
    level: string,
    message: string,
    data?: unknown,
  ): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] ${level}: ${message}`;

    if (data) {
      return `${baseMessage} ${JSON.stringify(data, null, 2)}`;
    }

    return baseMessage;
  }

  private log(
    level: LogLevel,
    levelName: string,
    message: string,
    data?: unknown,
  ): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(levelName, message, data);

    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
      }
    }

    if (this.config.enableStructured) {
      this.logStructured(level, message, data);
    }
  }

  private logStructured(
    level: LogLevel,
    message: string,
    data?: unknown,
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
      data,
      environment: process.env.NODE_ENV,
    };

    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, "DEBUG", message, data);
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, "INFO", message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, "WARN", message, data);
  }

  error(message: string, error?: unknown): void {
    this.log(LogLevel.ERROR, "ERROR", message, error);
  }

  time(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(label);
    }
  }

  apiRequest(method: string, url: string, data?: unknown): void {
    this.info(`${method.toUpperCase()} ${url}`, data);
  }

  apiResponse(status: number, url: string, data?: unknown): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const statusText = status >= 400 ? "ERROR" : "SUCCESS";
    this.log(level, "API", `${statusText} ${status} ${url}`, data);
  }

  cacheHit(key: string): void {
    this.info(`Cache hit for key: ${key}`);
  }

  cacheMiss(key: string): void {
    this.info(`Cache miss for key: ${key}`);
  }

  cacheSet(key: string, ttl: number): void {
    this.debug(`Cached data for key: ${key} with TTL: ${ttl}s`);
  }
}

export const logger = new Logger();

export type { LoggerConfig };
