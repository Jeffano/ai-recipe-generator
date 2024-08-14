import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Define the schema for the backend resources
const schema = a.schema({
  // Define a custom type 'BedrockResponse' with two properties: 'body' and 'error'
  BedrockResponse: a.customType({
    body: a.string(),   // The 'body' property is a string
    error: a.string(),  // The 'error' property is a string
  }),

  // Define a query 'askBedrock' in the schema
  askBedrock: a
    .query()  // Specify that this is a query type
    .arguments({ ingredients: a.string().array() })  // Define the query arguments with an array of strings
    .returns(a.ref("BedrockResponse"))  // Specify that the query returns a 'BedrockResponse' type
    .authorization((allow) => [allow.authenticated()])  // Set authorization to allow only authenticated users
    .handler(
      // Define the query handler configuration
      a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" })  // Use a custom handler with the entry point in 'bedrock.js' and the data source 'bedrockDS'
    ),
});

// Export the schema type for client usage
export type Schema = ClientSchema<typeof schema>;

// Define and export the data configuration for the backend
export const data = defineData({
  schema,  // Attach the defined schema to the data configuration
  authorizationModes: {
    // Set the default authorization mode
    defaultAuthorizationMode: "apiKey",
    // Configure the API key authorization mode
    apiKeyAuthorizationMode: {
      expiresInDays: 30,  // Set the expiration time for the API key to 30 days
    }
  }
});
