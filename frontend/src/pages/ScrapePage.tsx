import React, { useState } from 'react';
import RadioButtonsExample from '../components/RadioButtonsExample';
import {BASE_URL} from '../api/globalvariables'
import "../stylers/PDButtons.css";
import "../stylers/ScrapePage.css"
import sendAxiosRequest, { downloadFile, previewFile } from '../api/axios';
//import { downloadAsTxt } from '../const/utils';
import { RadioOption } from '../const/types';



// We define a functional TypeScript component called ScrapePage
const ScrapePage: React.FC = () => {
  // We define a urlInput state, initialized with a goal string, and a setUrlInput function to modify this state
  const [urlInput, setUrlInput] = useState<string|undefined>(undefined);
  // We define an error state, initialized with a goal string, and a setError function to modify this state
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<RadioOption>("requests");
  const [isScrapingDone, setIsScrapingDone] = useState(false);
  const [scrapedPage, setScrapedPage] = useState<string|null>(null);
  
  const handleScrape = async () => {
    console.log(selectedOption);
    console.log("sending to backend:", {
      url: urlInput,
      scraping_method: selectedOption,
  });
     if (!urlInput ){
      window.alert("insert valid url")
      return
     }
     const response = await sendAxiosRequest(`${BASE_URL}/scrape`, {url:urlInput, 
      scraping_method:selectedOption})
     if (response){
      console.log(response)
     
      setIsScrapingDone(true);
      
      setError(undefined); 
    
    console.log('Scrape triggered for:', urlInput); 
     }
  };

  const handlePreview = async () => {
    try {
      const previewContent = await previewFile(`${BASE_URL}/download/txt`);
      setScrapedPage(previewContent);
    } catch (err) {
      console.error("Error during preview: ", err);
      setError("Error fetching preview");
    }
  };



 
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

        {/* show buttons if scrapingDone */}
      {isScrapingDone && (
        <div className="buttonContainer">
          <button onClick={handlePreview}>Preview</button>
          <button onClick={() => downloadFile("http://127.0.0.1:5000/download/txt", "test.txt")} style={{marginLeft:'75px'}}>Download</button>
        </div>
      )}

       {/* cannot write if */}
      {scrapedPage && 
      <div>
        <h3>preview scraped page for <i>{urlInput}</i></h3>
        <textarea name="" id="" value={scrapedPage}/>
      </div>
      }

      <footer className='footer'>
      <p>&copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project</p>
      </footer>

    </div>
  );
};


export default ScrapePage;

