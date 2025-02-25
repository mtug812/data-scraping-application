import React, { useState } from 'react';
import RadioButtonsExample from '../components/RadioButtonsExample';
import "./ScrapePage.css"
//import PDButtons from '../components/PDButtons';
import "../stylers/PDButtons.css";
type RadioOption = "scrape1" | "scrape2" | "scrape3";

// We define a functional TypeScript component called ScrapePage
const ScrapePage: React.FC = () => {
  // We define a urlInput state, initialized with a goal string, and a setUrlInput function to modify this state
  const [urlInput, setUrlInput] = useState('');
  
  // We define an error state, initialized with a goal string, and a setError function to modify this state
  const [error, setError] = useState('');

  // Asynchronous function that takes care of the "scrape" process
  const handleScrape = async () => {
    console.log(selectedOption);
     
    setError(''); //resets the error message, if an error occurred before, it disappears.
    // We implement fetch logic in the future (Ticket #4), which will call an API
    console.log('Scrape triggered for:', urlInput); // Display in console message and urlInput value
  };

  

  const [selectedOption, setSelectedOption] = useState<RadioOption>("scrape1");


  // We return the JSX structure of the component
  return (
    // Create a container with Tailwind classes for appearance (min-height, background, padding)
    <div className=" min-h-screen bg-gray-100 p-4 flex flex-col items-center pt-20">
      {/* Main page title */}
      <h1 style={{outline:"2px",width:"100%"}}className="text-2xl font-bold mb-4 text-center">
        Web Scraping Made Simple
      <h2 className="m-0">Extract and clean web data</h2>
      </h1>
      
       {/* Input section where the user enters the URL */}
       <div className="inputContainer w-full max-w-md text-left">
        <h3 className="block mb-2 font-bold">Website URL:</h3>
        <input
          className="border rounded p-2 w-full" // Tailwind class for styling
          type="text"                           // The input type is text
          value={urlInput}                      // Input value is urlInput from component state
          onChange={(e) => setUrlInput(e.target.value)} // Update state when user taps
          placeholder="https://example.com"     // Display a placeholder in case the field is goal
        />
        
      </div>
      
      <RadioButtonsExample setter={setSelectedOption} getter={selectedOption}/>
     
      

      {/* Display error message if any */}
      {error && (
        <div className="text-red-600 mb-2">
          {error}
        </div>
      )}

      {/* Button that triggers the handleScrape function */}
      <button className="scrapeButton" onClick={handleScrape}>Scrape</button>

      

      <footer className='footer'>
      <p>&copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project</p>
      </footer>

    </div>
  );
};

// Export component to be used elsewhere in the application
export default ScrapePage;

//settings pt onclick +text

//css separat

//<PDButtons></PDButtons>

//PDButtons aufrufen!!