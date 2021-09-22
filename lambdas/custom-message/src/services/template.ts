import { compile } from "handlebars";
import logger from "../utils/logger";

const applyTemplate = (
  source: string,
  data: any
): string => {
  const template = compile(source);

  logger.debug(
    {
      source,
      data,
      template: "Applying values to template"
    },
    "Applying values to template");

  return template(data);
}

export { applyTemplate }
