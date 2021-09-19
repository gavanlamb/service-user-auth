import {CognitoIdentityServiceProvider} from "aws-sdk";
import {DescribeUserPoolClientRequest} from "aws-sdk/clients/cognitoidentityserviceprovider";
import logger from "../utils/logger";


const getDefaultUri = async (
  clientId: string,
  userPoolId: string): Promise<string> => {
  logger.debug(
    {
      clientId,
      userPoolId,
      template: "Getting default URI for user pool: %s and client id: %s"
    },
    "Getting default URI for user pool: %s and client id: %s",
    clientId,
    userPoolId
  )

  const client = new CognitoIdentityServiceProvider();
  const params: DescribeUserPoolClientRequest = {
    ClientId: clientId,
    UserPoolId: userPoolId
  };
  const userPoolClient = await client.describeUserPoolClient(params).promise();
  const defaultUri: string = userPoolClient.UserPoolClient?.DefaultRedirectURI ?? process.env.DEFAULT_URI as string;

  logger.debug(
    {
      clientId,
      userPoolId,
      template: "Returning default URI: %s for user pool: %s and client id: %s"
    },
    "Returning default URI: %s for user pool: %s and client id: %s",
    defaultUri,
    clientId,
    userPoolId
  )

  return defaultUri;
}

export { getDefaultUri }