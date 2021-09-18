import {compile} from "handlebars";
import {
    CustomMessageAdminCreateUserTriggerEvent,
    CustomMessageAuthenticationTriggerEvent,
    CustomMessageForgotPasswordTriggerEvent,
    CustomMessageResendCodeTriggerEvent,
    CustomMessageSignUpTriggerEvent,
    CustomMessageUpdateUserAttributeTriggerEvent, CustomMessageVerifyUserAttributeTriggerEvent
} from "aws-lambda";
import {getDefaultUri} from "./cognito";

const applyTemplate = (
    source: string,
    baseUrl:string,
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

    const data = {
        sub: event.request.userAttributes.sub,
        givenName: event.request.userAttributes.given_name,
        familyName: event.request.userAttributes.given_name,
        email: event.request.userAttributes.email,
        code: event.request.codeParameter,
        url: url
    }

    return template(data);
}

export { applyTemplate }
