import {
  PreTokenGenerationTriggerEvent,
  PreTokenGenerationTriggerHandler
} from "aws-lambda";
import logger from "./utils/logger";


export const handler:PreTokenGenerationTriggerHandler = async (
  event: PreTokenGenerationTriggerEvent
): Promise<PreTokenGenerationTriggerEvent> => {
  logger.debug(
    {
      event,
      template: "Event received for:%s"
    },
    "Event received for:%s",
    event.triggerSource
  )

  logger.debug(
    {
      event,
      template: "Returning Event for:%s"
    },
    "Returning Event for:%s",
    event.triggerSource
  )
  return event;
};
