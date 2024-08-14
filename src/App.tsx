import { FormEvent, useState } from "react";  // Import necessary hooks from React
import { Loader, Placeholder } from "@aws-amplify/ui-react";  // Import UI components from AWS Amplify
import "./App.css";  // Import custom CSS styles
import { Amplify } from "aws-amplify";  // Import Amplify configuration
import { Schema } from "../amplify/data/resource";  // Import the schema type
import { generateClient } from "aws-amplify/data";  // Import the function to generate an Amplify client
import outputs from "../amplify_outputs.json";  // Import Amplify outputs for configuration

import "@aws-amplify/ui-react/styles.css";  // Import AWS Amplify UI styles

// Configure Amplify with settings from the output file
Amplify.configure(outputs);

// Generate an Amplify client based on the defined schema and specify the authentication mode
const amplifyClient = generateClient<Schema>({
  authMode: "userPool",  // Use user pool authentication for the client
});

function App() {
  // State hooks for managing the result and loading state
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();  // Prevent default form submission behavior
    setLoading(true);  // Set loading state to true

    try {
      // Extract form data and prepare it for the query
      const formData = new FormData(event.currentTarget);
      
      // Make a query to askBedrock with the provided ingredients
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      // Check if there were no errors
      if (!errors) {
        // Update the result state with the response body
        setResult(data?.body || "No data returned");
      } else {
        // Log any errors encountered during the query
        console.log(errors);
      }

    } catch (e) {
      // Alert the user if an error occurs
      alert(`An error occurred: ${e}`);
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header section of the app */}
      <div className="header-container">
        <h1 className="main-header">
          Meet Your Personal
          <br />
          <span className="highlight">Recipe AI</span>
        </h1>
        <p className="description">
          Simply type a few ingredients using the format ingredient1,
          ingredient2, etc., and Recipe AI will generate an all-new recipe on
          demand...
        </p>
      </div>
      {/* Form for user input */}
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>
      {/* Display the result or a loading indicator */}
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            {/* Display loading indicators */}
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>  // Show the result if available
        )}
      </div>
    </div>
  );
}

export default App;
