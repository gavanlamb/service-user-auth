const packageVersion = process.env.PACKAGE_VERSION as string;
const environment = process.env.ENVIRONMENT as string;
const serviceName = process.env.SERVICE_NAME as string;
const memorySize = process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE as string;
const region = process.env.AWS_REGION as string;
const runtime = process.env.AWS_EXECUTION_ENV as string;
const lambdaFunctionVersion = process.env.AWS_LAMBDA_FUNCTION_VERSION as string;
const logLevel = (process.env.LOG_LEVEL || 'debug') as string;

import pino from 'pino-lambda';

const parentLogger = pino({
  name: serviceName,
  level: logLevel,
  formatters: {
    level(level: any) {
      return { level };
    },
  },
});

const logger = parentLogger.child({
  packageVersion,
  environment,
  memorySize,
  region,
  runtime,
  lambdaFunctionVersion,
});
export default logger;
