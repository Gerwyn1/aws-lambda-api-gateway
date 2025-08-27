import { APIGatewayProxyEventV2 } from "aws-lambda";

export const lambdaExample = async (event: any) => {
  console.log("TEMP Event log", event);
  return {
    message: "Hello World",
  };
};

export const homeRoute = async (event: APIGatewayProxyEventV2) => {
  console.log("Home Route Event Log", event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Welcome to the API!",
    }),
  };
};

export const createProfileRoute = async (event: APIGatewayProxyEventV2) => {
  console.log("TEMP Post Event", event);
  const body = JSON.parse(event.body ?? "{}");

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Profile created successfully",
      username: body.username,
    }),
  };
};

export const welcomeRoute = async (event: APIGatewayProxyEventV2) => {
  const username = process.env.USERNAME;
  const username2 = process.env.USERNAME2;
  const message = username ? `Welcome ${username}!` : `Welcome to the API!`;
  const message2 = username ? `Welcome ${username2}!` : `Welcome to the API2!`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
      message2,
    }),
  };
};
