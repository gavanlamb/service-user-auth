import {CognitoIdentityServiceProvider} from "aws-sdk";
import {DescribeUserPoolClientRequest} from "aws-sdk/clients/cognitoidentityserviceprovider";
import logger from "../utils/logger";


const getClientScopes = async (
  clientId: string,
  userPoolId: string): Promise<string> => {
  logger.debug(
    {
      clientId,
      userPoolId,
      template: "Getting client scopes for user pool:%s and client id:%s"
    },
    "Getting client scopes for user pool:%s and client id:%s",
    clientId,
    userPoolId
  )

  const client = new CognitoIdentityServiceProvider();
  const params: DescribeUserPoolClientRequest = {
    ClientId: clientId,
    UserPoolId: userPoolId
  };

  try {
    const userPoolClient = await client.describeUserPoolClient(params).promise();
    const scopes = userPoolClient.UserPoolClient?.AllowedOAuthScopes?.join(" ") ?? "";

    logger.debug(
      {
        clientId,
        userPoolId,
        template: "Returning scopes:%s for user pool:%s and client id:%s"
      },
      "Returning scopes:%s for user pool:%s and client id:%s",
      scopes,
      clientId,
      userPoolId
    )

    return scopes;
  } catch(error) {
    logger.error(
      {
        error,
        clientId,
        userPoolId
      },
      "Failed to retrieve user pool client:%s scopes",
      clientId);
  }
  return "";
}

export { getClientScopes }
