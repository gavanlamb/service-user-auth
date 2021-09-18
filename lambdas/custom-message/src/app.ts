import {
  CustomMessageAdminCreateUserTriggerEvent,
  CustomMessageAuthenticationTriggerEvent,
  CustomMessageForgotPasswordTriggerEvent,
  CustomMessageResendCodeTriggerEvent,
  CustomMessageSignUpTriggerEvent,
  CustomMessageUpdateUserAttributeTriggerEvent,
  CustomMessageVerifyUserAttributeTriggerEvent
} from "aws-lambda";

import { getDefaultUri } from "./services/cognito";
import { getMessageTemplateOrDefault } from "./services/dynamo";
import { compile } from "handlebars";
import {applyTemplate} from "./services/template";

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

  const baseUrl = await getDefaultUri(event.callerContext.clientId, event.userPoolId);

  const dynamoRecord = await getMessageTemplateOrDefault(event.triggerSource, 'default');
  event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, baseUrl, event);
  event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, baseUrl, event);
  event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, baseUrl, event);

  return event;
};
