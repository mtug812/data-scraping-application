import React, { useState } from 'react'; // Importă React și hook-ul useState din bibliotecă
import RadioButtonsExample from '../components/RadioButtonsExample';
import "./ScrapePage.css"
type RadioOption = "scrape1" | "scrape2" | "scrape3";

// Definim un component funcțional TypeScript numit ScrapePage
const ScrapePage: React.FC = () => {
  // Definim o stare urlInput, inițializată cu un string gol, și o funcție setUrlInput pentru a modifica această stare
  const [urlInput, setUrlInput] = useState('');
  
  // Definim o stare error, inițializată cu un string gol, și o funcție setError pentru a modifica această stare
  const [error, setError] = useState('');

  // Funcția asincronă care se ocupă de procesul de "scrape"
  const handleScrape = async () => {
    console.log(selectedOption);
     
    setError(''); //setzt die Fehlermeldung zurück, wenn vorher ein Fehler aufgetreten ist, verschwindet dieser.
    // TODO: Aici va fi implementată logica de fetch în viitor (Ticket #4), care va apela un API
    console.log('Scrape triggered for:', urlInput); // Afișăm în consolă mesajul și valoarea urlInput
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
      <button className="scrapeButton" onClick={handleScrape} // When the button is pressed, handleScrape is executed
      >
        Scrape
      </button>

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