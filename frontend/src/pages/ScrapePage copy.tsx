import React, { useState } from "react";
import RadioButtonsExample from "../components/RadioButtonsExample";
import { BASE_URL } from "../api/globalvariables";
import "../stylers/PDButtons.css";
import "../stylers/ScrapePage.css";
import  { downloadFile, previewFile } from "../api/axios";
import { RadioOption } from "../const/types";
import Navbar from "../components/Navbar";
import "../components/Navbar";
import axios from "axios";

// We define a functional TypeScript component called ScrapePage
const ScrapePage: React.FC = () => {
  // We define a urlInput state, initialized with a goal string, and a setUrlInput function to modify this state
  const [urlInput, setUrlInput] = useState<string | undefined>(undefined);
  // We define an error state, initialized with a goal string, and a setError function to modify this state
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<RadioOption>("requests");
  const [isScrapingDone, setIsScrapingDone] = useState(false);
  const [scrapedPage, setScrapedPage] = useState<string | null>(null);
  //am adaugat si asta
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("authToken"); //usememo

  const handlePreview = async () => {
    try {
      const previewContent = await previewFile(`${BASE_URL}/scrape`);
      if (previewContent) setScrapedPage(previewContent);
    } catch (err) {
      console.error("Error during preview: ", err);
      setError("Error fetching preview");
    }
  };

  const handleScrape = async () => {
    if (!urlInput) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);

      console.log("Sending to backend:", {
        url: urlInput,
        scraping_method: selectedOption,
      });

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const axiosResponse = await axios.post(
        `${BASE_URL}/scrape`,
        {
          url: urlInput,
          scraping_method: selectedOption,
        },
        {
          headers,
        },
      );
      const response = axiosResponse.data;
      if (response && response.status === 1) {
        console.log("Scraping successful:", response);
        setIsScrapingDone(true);

        // Store the scraped result directly from the response
        setScrapedPage(response.scrape_result);
        setError(undefined);
      } else {
        // Handle error from backend
        setError(response?.error || "An error occurred during scraping");
        setIsScrapingDone(false);
      }
    } catch (err) {
      console.error("Error during scraping:", err);
      setError("Failed to scrape the website. Please try again.");
      setIsScrapingDone(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Create a container with Tailwind classes for appearance (min-height, background, padding)
    <div className=" min-h-screen bg-gray-100 p-4 flex flex-col items-center pt-20">
      {/* Main page title */}
      <h1 style={{ outline: "2px", width: "100%" }} className="text-2xl font-bold mb-4 text-center">
        Web Scraping Made Simple
        <h2 className="m-0">Extract and clean web data</h2>
      </h1>

      <Navbar />


      {/* Input section where the user enters the URL */}
      <div className="inputContainer w-full max-w-md text-left">
        <h3 className="block mb-2 font-bold">Website URL:</h3>
        <input
          className="border rounded p-2 w-full" // Tailwind class for styling
          type="text" // The input type is text
          value={urlInput} // Input value is urlInput from component state
          onChange={(e) => setUrlInput(e.target.value)} // Update state when user taps
          placeholder="https://example.com" // Display a placeholder in case the field is goal
        />
      </div>

      <RadioButtonsExample setter={setSelectedOption} getter={selectedOption} />

      {/* Display error message if any */}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {/* Button that triggers the handleScrape function */}
      <button className="scrapeButton" onClick={handleScrape}>
        Scrape
      </button>

      {/* show buttons if scrapingDone */}
      {isScrapingDone && (
        <div className="buttonContainer">
          <button onClick={handlePreview}>Preview</button>
          <button
            onClick={() => {
              if (scrapedPage) {
                downloadFile(scrapedPage, `scraped-${new Date().toISOString().slice(0, 10)}.txt`);
              } else {
                setError("No content for downloading");
              }
            }}
            style={{ marginLeft: "75px" }}
          >
            Download
          </button>
        </div>
      )}

      {/* cannot write if */}
      {scrapedPage && (
  <div>
    <h3>
      Preview scraped page for <i>{urlInput}</i>
    </h3>
    <textarea
      value={scrapedPage}
      style={{
        width: "100%",
        minHeight: "200px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        fontFamily: "monospace",
        resize: "vertical"
      }}
    />
  </div>
)}


      <footer className="footer">
        <p>&copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project</p>
      </footer>
    </div>
  );
};

export default ScrapePage;
