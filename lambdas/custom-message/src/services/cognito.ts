import {CognitoIdentityServiceProvider} from "aws-sdk";
import {DescribeUserPoolClientRequest} from "aws-sdk/clients/cognitoidentityserviceprovider";


const getDefaultUri = async (
  clientId: string,
  userPoolId: string): Promise<string> => {

  const client = new CognitoIdentityServiceProvider();
  const params: DescribeUserPoolClientRequest = {
    ClientId: clientId,
    UserPoolId: userPoolId
  };
  const userPoolClient = await client.describeUserPoolClient(params).promise();
  // @ts-ignore
  return userPoolClient.UserPoolClient.DefaultRedirectURI;
}

export { getDefaultUri }