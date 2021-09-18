// Lookup message in dynamo

// Replace template values

// Set value

// Finish

import {
  CustomMessageAdminCreateUserTriggerEvent,
  CustomMessageAuthenticationTriggerEvent,
  CustomMessageForgotPasswordTriggerEvent,
  CustomMessageResendCodeTriggerEvent,
  CustomMessageSignUpTriggerEvent,
  CustomMessageUpdateUserAttributeTriggerEvent,
  CustomMessageVerifyUserAttributeTriggerEvent
} from "aws-lambda";

export const handler = (
  event:
    | CustomMessageAdminCreateUserTriggerEvent
    | CustomMessageAuthenticationTriggerEvent
    | CustomMessageForgotPasswordTriggerEvent
    | CustomMessageResendCodeTriggerEvent
    | CustomMessageSignUpTriggerEvent
    | CustomMessageUpdateUserAttributeTriggerEvent
    | CustomMessageVerifyUserAttributeTriggerEvent
) => {
  console.log(JSON.stringify(event));
  return event;
};
