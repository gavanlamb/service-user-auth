import { compile } from "handlebars";
import {
  CustomMessageAdminCreateUserTriggerEvent,
  CustomMessageAuthenticationTriggerEvent,
  CustomMessageForgotPasswordTriggerEvent,
  CustomMessageResendCodeTriggerEvent,
  CustomMessageSignUpTriggerEvent,
  CustomMessageUpdateUserAttributeTriggerEvent,
  CustomMessageVerifyUserAttributeTriggerEvent
} from "aws-lambda";
import logger from "../utils/logger";

const applyTemplate = (
  source: string,
  baseUrl: string,
  event: CustomMessageAdminCreateUserTriggerEvent
    | CustomMessageAuthenticationTriggerEvent
    | CustomMessageForgotPasswordTriggerEvent
    | CustomMessageResendCodeTriggerEvent
    | CustomMessageSignUpTriggerEvent
    | CustomMessageUpdateUserAttributeTriggerEvent
    | CustomMessageVerifyUserAttributeTriggerEvent
): string => {
  const url = `${baseUrl}/auth/verify?verificationCode=${event.request.codeParameter}&sub=${event.userName}`
  const template = compile(source);

  logger.debug(
    {
      source,
      baseUrl,
      event,
      template: "Applying values to template"
    },
    "Applying values to template");

  const data = {
    sub: event.request.userAttributes.sub,
    givenName: event.request.userAttributes.given_name,
    familyName: event.request.userAttributes.given_name,
    email: event.request.userAttributes.email,
    code: event.request.codeParameter,
    url: url
  }

  const value = template(data);

  return value
}

export { applyTemplate }
