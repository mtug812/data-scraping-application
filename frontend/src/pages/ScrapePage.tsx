import React, { useState } from "react";
import RadioButtonsExample from "../components/RadioButtonsExample";
import { BASE_URL } from "../api/globalvariables";
import { downloadFile } from "../api/axios";
import { RadioOption } from "../const/types";
import Navbar from "../components/Navbar";
import axios from "axios";

const ScrapePage: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<RadioOption>("requests");
  const [isScrapingDone, setIsScrapingDone] = useState(false);
  const [scrapedPage, setScrapedPage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const token = localStorage.getItem("authToken");
// Add these new state variables to ScrapePage
const [cleanData, setCleanData] = useState<boolean>(false);
const [companyName, setCompanyName] = useState<string>("");

  const handlePreview = () => {
    // Simply show the content we already have without making an API call
    setShowPreview(true);
  };

  const handleScrape = async () => {
    if (!urlInput) {
      setError("Please enter a valid URL");
      return;
    }
  
    if (selectedOption === "selenium" && !companyName) {
      setError("Company name is required for Selenium scraping");
      return;
    }
  
    try {
      setIsLoading(true);
      setError(undefined);
  
      console.log("Sending to backend:", {
        url: urlInput,
        scraping_method: selectedOption,
        clean_data: cleanData,
        company_name: companyName,
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
          clean_data: cleanData,
          company_name: selectedOption === "selenium" ? companyName : undefined,
        },
        {
          headers,
        },
      );
      const response = axiosResponse.data;
      if (response && response.status === 1) {
        console.log("Scraping successful:", response);
        setIsScrapingDone(true);
        setScrapedPage(response.scrape_result);
        setError(undefined);
      } else {
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
    <div className="flex min-h-screen w-full">
      {/* left pannel*/}
      <div className="w-1/3 bg-blue-600 text-white flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold mb-4">Web Scraper App</h2>
          <p className="text-xl mb-6">Extract data from websites with ease</p>
          
          <div className="border-t border-blue-400 pt-6 mt-6 w-full">
            <p className="mb-4">Our tool allows you to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Scrape content from static websites</li>
              <li>Save results as text files</li>
              <li>View your scraping history</li>
              <li>Choose between different scraping methods</li>
            </ul>
          </div>
        </div>
        
        {/* Footer */}
        <div className="py-3 text-center text-sm border-t border-blue-500">
          &copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project
        </div>
      </div>

      {/* right pannel */}
      <div className="w-2/3 bg-gray-100 flex flex-col">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-1">Web Scraping Made Simple</h1>
          <p className="text-gray-600 mb-6">Extract and clean web data</p>
          
          <Navbar />
          
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            {/* Input section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Website URL:</h3>
              <input
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Select scraping options:</h3>
              <RadioButtonsExample 
                  setter={setSelectedOption} 
                  getter={selectedOption} 
                  cleanData={cleanData}
                  setCleanData={setCleanData}
                  companyName={companyName}
                  setCompanyName={setCompanyName}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="w-full bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200">
                {error}
              </div>
            )}

           {/* Scrape button */}
            <button
              className="w-64 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleScrape}
              disabled={isLoading}
            >
              {isLoading ? "Scraping..." : "Scrape"}
            </button>

            {/* Preview and Download buttons */}
            {isScrapingDone && (
              <div className="mt-6 flex justify-start">
                <div className="w-64 flex space-x-2">
                  <button 
                    className="w-1/2 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" 
                    onClick={handlePreview}
                  >
                    Preview
                  </button>
                  <button
                    className="w-1/2 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() => {
                      if (scrapedPage) {
                        downloadFile(scrapedPage, urlInput);
                      } else {
                        setError("No content for downloading");
                      }
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
            
            {/* Preview area */}
            {showPreview && scrapedPage && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Preview scraped page for <span className="text-blue-600">{urlInput}</span>
                </h3>
                <textarea
                  value={scrapedPage}
                  readOnly
                  className="w-full min-h-[300px] border border-gray-300 rounded-md p-3 font-mono resize-y focus:outline-none focus:border-blue-500 bg-gray-50"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapePage;