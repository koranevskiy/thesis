import { Injectable, LogLevel, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { AppConfig } from "#config/app.config";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { Client } from "@elastic/elasticsearch";
import { format, transports } from "winston";

@Injectable()
export class CustomLogger implements LoggerService {
  private readonly logger: LoggerService;

  constructor(private readonly configService: ConfigService) {
    const appCfg = configService.get<AppConfig>("app");
    if (appCfg.loggerTransport === "elastic") {
      const transport = new ElasticsearchTransport({
        level: appCfg.logLevel,
        index: appCfg.elasticIndex,
        client: new Client({
          node: appCfg.elasticNode,
        }),
      });
      this.logger = WinstonModule.createLogger({
        transports: [transport],
        format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
        level: appCfg.logLevel,
      });
    } else {
      const customFormat = format.printf(({ timestamp, level, stack, message, context, type, name }) => {
        return (
          `${timestamp} - [${level.toUpperCase()}] - ${stack || message} ` +
          (context ? `- CONTEXT: ${context}` : "") +
          `${type ?? ""} ${name ?? ""}`
        );
      });

      this.logger = WinstonModule.createLogger({
        format: format.combine(format.timestamp(), customFormat),
        transports: [new transports.Console()],
      });
    }
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.log(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, ...optionalParams);
  }

  fatal?(message: any, ...optionalParams: any[]) {
    this.logger.fatal(message, ...optionalParams);
  }

  setLogLevels?(levels: LogLevel[]) {
    this.logger.setLogLevels(levels);
  }
}
