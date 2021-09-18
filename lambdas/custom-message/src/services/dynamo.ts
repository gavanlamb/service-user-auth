import { DynamoDB } from "aws-sdk";

type MessageDetails = {
    EmailSubject: string,
    EmailTemplate: string,
    SmsTemplate: string
}

const getMessageTemplateOrDefault = async(
    messageType: string,
    organisation: string):Promise<MessageDetails> => {
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

    if(response.Item){
        return {
            EmailSubject: response.Item.EmailSubject,
            EmailTemplate: response.Item.EmailTemplate,
            SmsTemplate: response.Item.SmsTemplate,
        }
    } else {
        response = await client.get(
            {
                TableName: process.env.TABLE_NAME as string,
                Key: {
                    MessageType: messageType,
                    Organisation: 'default'
                }
            }
        ).promise();

        return {
            EmailSubject: response.Item?.EmailSubject,
            EmailTemplate: response.Item?.EmailTemplate,
            SmsTemplate: response.Item?.SmsTemplate,
        }
    }
}

export { getMessageTemplateOrDefault }
