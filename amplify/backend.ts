import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

// Define the backend resources using Amplify's backend definition function
const backend = defineBackend({
  // Include authentication and data resources in the backend configuration
  auth,
  data
});

// Add an HTTP data source to the GraphQL API defined in the backend configuration
// This data source will be used to interact with the Bedrock service
const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",  // Identifier for the data source
  "https://bedrock-runtime.us-east-1.amazonaws.com",  // URL for the Bedrock runtime API endpoint
  {
    // Configuration for authorization when making requests to the data source
    authorizationConfig: {
      // Specify the AWS region where Bedrock service is located
      signingRegion: "us-east-1",
      // Define the AWS service name for signing requests
      signingServiceName: "bedrock",
    },
  }
);

// Grant permissions to the HTTP data source's principal to invoke the Bedrock model
bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    // Specify the ARN of the Bedrock model that can be invoked
    resources: [
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
    ],
    // Define the allowed actions for the model invocation
    actions: ["bedrock:InvokeModel"],
  })
);
