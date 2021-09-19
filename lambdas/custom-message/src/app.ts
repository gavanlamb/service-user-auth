import { getDefaultUri } from "./services/cognito";
import { getMessageTemplateOrDefault } from "./services/dynamo";
import { applyTemplate } from "./services/template";
import {
  CustomMessageAdminCreateUserTriggerEvent,
  CustomMessageAuthenticationTriggerEvent,
  CustomMessageForgotPasswordTriggerEvent,
  CustomMessageResendCodeTriggerEvent,
  CustomMessageSignUpTriggerEvent,
  CustomMessageUpdateUserAttributeTriggerEvent,
  CustomMessageVerifyUserAttributeTriggerEvent
} from "aws-lambda";
import logger from "./utils/logger";


export const handler = async (
  event: CustomMessageAdminCreateUserTriggerEvent
    | CustomMessageAuthenticationTriggerEvent
    | CustomMessageForgotPasswordTriggerEvent
    | CustomMessageResendCodeTriggerEvent
    | CustomMessageSignUpTriggerEvent
    | CustomMessageUpdateUserAttributeTriggerEvent
    | CustomMessageVerifyUserAttributeTriggerEvent
): Promise<CustomMessageAdminCreateUserTriggerEvent
  | CustomMessageAuthenticationTriggerEvent
  | CustomMessageForgotPasswordTriggerEvent
  | CustomMessageResendCodeTriggerEvent
  | CustomMessageSignUpTriggerEvent
  | CustomMessageUpdateUserAttributeTriggerEvent
  | CustomMessageVerifyUserAttributeTriggerEvent> => {
  logger.debug(
    {
      event,
      template: "Event received for:%s"
    },
    "Event received for:%s",
    event.triggerSource
  )

  const baseUrl = await getDefaultUri(event.callerContext.clientId, event.userPoolId);
  const dynamoRecord = await getMessageTemplateOrDefault(event.triggerSource, 'default');

  event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, baseUrl, event);
  event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, baseUrl, event);
  event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, baseUrl, event);

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
