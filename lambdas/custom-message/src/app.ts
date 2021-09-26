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
        sub: event.request.userAttributes.sub,
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url: `${baseUrl}/auth/verify?code=${event.request.codeParameter}&sub=${event.userName}`
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsAndEmailSubjectTemplateData = {
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        code: event.request.codeParameter,
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, smsAndEmailSubjectTemplateData);
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsAndEmailSubjectTemplateData);
      break;
    }
    case "CustomMessage_UpdateUserAttribute":
    case "CustomMessage_VerifyUserAttribute":{
      const emailTemplateData = {
        sub: event.request.userAttributes.sub,
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url: `${baseUrl}/auth/verify?code=${event.request.codeParameter}&sub=${event.userName}`
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsAndEmailSubjectTemplateData = {
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        code: event.request.codeParameter,
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, smsAndEmailSubjectTemplateData);
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsAndEmailSubjectTemplateData);
      break;
    }
    case "CustomMessage_AdminCreateUser":{
      const url = `${baseUrl}/auth/login`;
      const emailTemplateData = {
        sub: event.request.userAttributes.sub,
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url,
        username: event.request.usernameParameter
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsTemplateData = {
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        code: event.request.codeParameter,
        url,
      }
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsTemplateData);

      const emailSubjectTemplateData = {
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        code: event.request.codeParameter
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, emailSubjectTemplateData);
      break;
    }
    case "CustomMessage_ForgotPassword":{
      const emailTemplateData = {
        sub: event.request.userAttributes.sub,
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url: `${baseUrl}/auth/reset-password?code=${event.request.codeParameter}&sub=${event.userName}`
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsAndEmailSubjectTemplateData = {
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        code: event.request.codeParameter,
      }
      event.response.emailSubject = applyTemplate(dynamoRecord.EmailSubject, smsAndEmailSubjectTemplateData);
      event.response.smsMessage = applyTemplate(dynamoRecord.SmsTemplate, smsAndEmailSubjectTemplateData);
      break;
    }
    case "CustomMessage_Authentication":{
      const emailTemplateData = {
        sub: event.request.userAttributes.sub,
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter
      }
      event.response.emailMessage = applyTemplate(dynamoRecord.EmailTemplate, emailTemplateData);

      const smsAndEmailSubjectTemplateData = {
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
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
