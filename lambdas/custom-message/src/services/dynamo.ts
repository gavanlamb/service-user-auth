import {DynamoDB} from "aws-sdk";
import logger from "../utils/logger";

type MessageDetails = {
  EmailSubject: string,
  EmailTemplate: string,
  SmsTemplate: string
}

const getMessageTemplateOrDefault = async (
  messageType: string,
  organisation: string): Promise<MessageDetails> => {
  logger.debug(
    {
      messageType,
      organisation,
      template: "Getting template for message:%s for organisation:%s"
    },
    "Getting template for message:%s and organisation:%s",
    messageType,
    organisation
  );

  const client = new DynamoDB.DocumentClient;
  let response = await client.get(
    {
      TableName: process.env.TABLE_NAME as string,
      Key: {
        MessageType: messageType,
        Organisation: organisation
      }
    }
  ).promise();

  if (response.Item) {
    logger.debug(
      {
        messageType,
        organisation,
        template: "Found template for message:%s and organisation:%s"
      },
      "Found template for message:%s and organisation:%s",
      messageType,
      organisation);

    return {
      EmailSubject: response.Item.EmailSubject,
      EmailTemplate: response.Item.EmailTemplate,
      SmsTemplate: response.Item.SmsTemplate,
    }
  } else {
    logger.debug(
      {
        messageType,
        organisation,
        template: "Template was not found for message:%s and organisation:%s, getting default template."
      },
      "Template was not found for message:%s and organisation:%s, getting default template.",
      messageType,
      organisation);

    response = await client.get(
      {
        TableName: process.env.TABLE_NAME as string,
        Key: {
          MessageType: messageType,
          Organisation: 'default'
        }
      }).promise();

    return {
      EmailSubject: response.Item?.EmailSubject,
      EmailTemplate: response.Item?.EmailTemplate,
      SmsTemplate: response.Item?.SmsTemplate,
    }
  }
}

export { getMessageTemplateOrDefault }
