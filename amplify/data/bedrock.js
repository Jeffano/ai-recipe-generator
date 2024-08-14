// This function constructs and returns a configuration for making a request to the Anthropic API
export function request(ctx) {
    // Extract ingredients from context arguments, defaulting to an empty array if not provided
    const { ingredients = [] } = ctx.args;

    // Construct the prompt by joining the ingredients with commas
    // The prompt asks for a recipe idea using the provided ingredients
    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

    // Return the request configuration object
    return {
        // Define the API resource path for invoking the model
        resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
        // Specify the HTTP method to be used for the request
        method: "POST",
        // Define the parameters for the HTTP request
        params: {
            // Set the request headers to indicate JSON content
            headers: {
                "Content-Type": "application/json",
            },
            // Define the request body with necessary details
            body: JSON.stringify({
                // Specify the Anthropic model version to use
                anthropic_version: "bedrock-2023-05-31",
                // Set the maximum number of tokens to be generated in the response
                max_tokens: 1000,
                // Define the messages to be sent to the model
                messages: [
                    {
                        // Set the role of the sender as 'user'
                        role: "user",
                        // Include the prompt text as part of the message content
                        content: [
                            {
                                // Specify the type of content as 'text'
                                type: "text",
                                // Format the prompt with a newline before and after the user and assistant roles
                                text: `\n\nHuman: ${prompt}\n\nAssistant`
                            },
                        ],
                    },
                ],
            }),
        }
    };
}

// This function processes and returns the response from the Anthropic API
export function response(ctx) {
    // Parse the JSON response body from the context result
    const parsedBody = JSON.parse(ctx.result.body);

    // Extract the text content from the parsed response body
    // Assumes that the content is in the first element of the 'content' array
    const res = {
        // Define the body of the response to include the text content
        body: parsedBody.content[0].text,
    };
    
    // Return the extracted response body
    return res;
}
