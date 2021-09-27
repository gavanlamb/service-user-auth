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
  const dynamoRecord = await getMessageTemplateOrDefault(event.triggerSource, 'default');
  const baseUrl = await getDefaultUri(event.callerContext.clientId, event.userPoolId);

  switch (event.triggerSource){
    case "CustomMessage_SignUp":
    case "CustomMessage_ResendCode":{
      const emailTemplateData = {
        userId: event.request.userAttributes.sub,
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url: `${baseUrl}/auth/verify?code=${event.request.codeParameter}&user-id=${event.request.userAttributes.sub}`
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsAndEmailSubjectTemplateData = {
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        code: event.request.codeParameter,
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, smsAndEmailSubjectTemplateData);
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsAndEmailSubjectTemplateData);
      break;
    }
    case "CustomMessage_UpdateUserAttribute":
    case "CustomMessage_VerifyUserAttribute":{
      const emailTemplateData = {
        userId: event.request.userAttributes.sub,
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url: `${baseUrl}/auth/verify?code=${event.request.codeParameter}&user-id=${event.request.userAttributes.sub}`
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsAndEmailSubjectTemplateData = {
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        code: event.request.codeParameter,
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, smsAndEmailSubjectTemplateData);
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsAndEmailSubjectTemplateData);
      break;
    }
    case "CustomMessage_AdminCreateUser":{
      const url = `${baseUrl}/auth/login`;
      const emailTemplateData = {
        userId: event.request.userAttributes.sub,
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url,
        username: event.request.usernameParameter
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsTemplateData = {
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        code: event.request.codeParameter,
        url,
      }
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsTemplateData);

      const emailSubjectTemplateData = {
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        code: event.request.codeParameter
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, emailSubjectTemplateData);
      break;
    }
    case "CustomMessage_ForgotPassword":{
      const emailTemplateData = {
        userId: event.request.userAttributes.sub,
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url: `${baseUrl}/auth/reset-password?code=${event.request.codeParameter}&user-id=${event.request.userAttributes.sub}`
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsAndEmailSubjectTemplateData = {
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        code: event.request.codeParameter,
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, smsAndEmailSubjectTemplateData);
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsAndEmailSubjectTemplateData);
      break;
    }
    case "CustomMessage_Authentication":{
      const emailTemplateData = {
        userId: event.request.userAttributes.sub,
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsAndEmailSubjectTemplateData = {
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.family_name,
        code: event.request.codeParameter,
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, smsAndEmailSubjectTemplateData);
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsAndEmailSubjectTemplateData);
      break;
    }
  }

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
