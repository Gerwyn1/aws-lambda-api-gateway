import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import * as apigateway_integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class LambdaGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const exampleLambda = new NodejsFunction(this, "ExampleHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handle.ts"),
      handler: "lambdaExample",
      functionName: "cdk-course-example-lambda",
    });

    new cdk.CfnOutput(this, "ExampleLambdaArn", {
      value: exampleLambda.functionArn,
      description: "The ARN of the example lambda function",
    });

    const homeLambda = new NodejsFunction(this, "HomeHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handle.ts"),
      handler: "homeRoute",
      functionName: `${this.stackName}-home-route-lambda`,
    });

    const httpApi = new apigateway.HttpApi(this, "FirstApi", {
      apiName: "First API",
      description: "First API with CDK",
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [apigateway.CorsHttpMethod.ANY],
        allowHeaders: ["*"],
      },
    });

    httpApi.addRoutes({
      path: "/",
      methods: [apigateway.HttpMethod.GET],
      integration: new apigateway_integrations.HttpLambdaIntegration(
        "HomeIntegration",
        homeLambda
      ),
    });

    new cdk.CfnOutput(this, "HttpApiUrl", {
      value: httpApi.url!,
      description: "HTTP API URL",
    });

    const createProfileLambda = new NodejsFunction(this, "ProfileHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handle.ts"),
      handler: "createProfileRoute",
      functionName: `${this.stackName}-profile-lambda`,
    });

    httpApi.addRoutes({
      path: "/profile",
      methods: [apigateway.HttpMethod.POST],
      integration: new apigateway_integrations.HttpLambdaIntegration(
        "ProfileIntegration",
        createProfileLambda
      ),
    });
    //
    const welcomeLambda = new NodejsFunction(this, "WelcomeHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handle.ts"),
      handler: "welcomeRoute",
      functionName: `${this.stackName}-welcome-route`,
      environment: {
        USERNAME: "Courage the Cowardly Dog",
      },
    });

    welcomeLambda.addEnvironment("USERNAME2", "Courage the Cowardly Dog2");

    httpApi.addRoutes({
      path: "/welcome",
      methods: [apigateway.HttpMethod.GET],
      integration: new apigateway_integrations.HttpLambdaIntegration(
        "WelcomeIntegration",
        welcomeLambda
      ),
    });
  }
}
