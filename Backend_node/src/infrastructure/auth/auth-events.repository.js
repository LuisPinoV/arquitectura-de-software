import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export class AuthEventsRepository {
  constructor(createdUserTopicArn, loggedinUserTopicArn) {
    this.createdUserTopicArn = createdUserTopicArn;
    this.loggedinUserTopicArn = loggedinUserTopicArn;
    this.snsClient = new SNSClient({});
  }

  async onCreatedUser(username, userId) {
    const params = {
      TopicArn: this.createdUserTopicArn,
      Message: JSON.stringify({
        username: username,
        userId: userId,
      }),
    };

    try {
      const response = await this.snsClient.send(new PublishCommand(params));

      console.log("SNS message published:", response.MessageId);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Created User message published succesfully",
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Couldn't publish create user message: ",
          err,
        }),
      };
    }
  }

  async onUserLoggedIn(username, userId) {
    const params = {
      TopicArn: this.loggedinUserTopicArn,
      Message: JSON.stringify({
        username: username,
        userId: userId,
      }),
    };

    try {
      const response = await this.snsClient.send(new PublishCommand(params));

      console.log("SNS message published:", response.MessageId);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Created User message published succesfully",
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Couldn't publish create user message: ",
          err,
        }),
      };
    }
  }
}
