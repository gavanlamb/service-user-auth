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

import { CognitoIdentityServiceProvider } from "aws-sdk";
import {DescribeUserPoolClientRequest} from "aws-sdk/clients/cognitoidentityserviceprovider";

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

  // Get client url TODO ADD IAM PERMISSIONS
  const client = new CognitoIdentityServiceProvider();
  const params: DescribeUserPoolClientRequest = {
    ClientId:  event.callerContext.clientId,
    UserPoolId:  event.userPoolId
  }
  const t = await client.describeUserPoolClient(params).promise();
  console.log(JSON.stringify(t));


  const userId = event.userName;
  event.response.smsMessage = event.request.codeParameter;
  event.response.emailSubject = event.request.codeParameter;
  event.response.emailMessage = event.request.codeParameter;

  return event;
};
