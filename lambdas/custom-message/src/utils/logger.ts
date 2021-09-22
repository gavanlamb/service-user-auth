import pino from 'pino-lambda';

const parentLogger = pino({
  name: process.env.SERVICE_NAME as string,
  level: process.env.LOG_LEVEL as string,
  formatters: {
    level(level: any) {
      return { level };
    },
  },
});

const logger = parentLogger.child({
  packageVersion: process.env.PACKAGE_VERSION as string,
  environment: process.env.ENVIRONMENT as string,
  memorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE as string,
  region: process.env.AWS_REGION as string,
  runtime: process.env.AWS_EXECUTION_ENV as string,
  lambdaFunctionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION as string,
});
export default logger;
