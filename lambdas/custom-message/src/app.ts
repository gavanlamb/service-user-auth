import {
  CustomMessageAdminCreateUserTriggerEvent,
  CustomMessageAuthenticationTriggerEvent,
  CustomMessageForgotPasswordTriggerEvent,
  CustomMessageResendCodeTriggerEvent,
  CustomMessageSignUpTriggerEvent,
  CustomMessageUpdateUserAttributeTriggerEvent,
  CustomMessageVerifyUserAttributeTriggerEvent
} from "aws-lambda";

import {getDefaultUri} from "./services/cognito";

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
  console.log(JSON.stringify(event));

  switch (event.triggerSource){
    case "CustomMessage_SignUp":
      const baseUrl = await getDefaultUri(event.callerContext.clientId, event.userPoolId);
      const url = `${baseUrl}/auth/verify?verificationCode=${event.request.codeParameter}&sub=${event.userName}`

      // Get value from Dynamo
      // Replace the url template with the value above
      // return

      event.response.smsMessage = event.request.codeParameter;
      event.response.emailSubject = "Verify your account";
      event.response.emailMessage = url;
      break;
  }

  return event;
};
