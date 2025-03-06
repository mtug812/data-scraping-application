import React, { useState } from "react";
import RadioButtonsExample from "../components/RadioButtonsExample";
import { BASE_URL } from "../api/globalvariables";
import "../stylers/PDButtons.css";
import "../stylers/ScrapePage.css";
import { downloadFile } from "../api/axios";
import { RadioOption } from "../const/types";
import Navbar from "../components/Navbar";
import "../components/Navbar";
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

  const handlePreview = () => {
    // Simply show the content we already have without making an API call
    setShowPreview(true);
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header with background */}
      <div className="w-full bg-blue-600 text-white py-4">
        <h1 className="text-2xl font-bold text-center mb-1">Web Scraping Made Simple</h1>
        <h2 className="text-base font-normal text-center">Extract and clean web data</h2>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 pb-16">
        <Navbar />

        {/* Input section */}
        <div className="w-full text-left my-4">
          <h3 className="block mb-2 font-bold">Website URL:</h3>
          <input
            className="border rounded p-2 w-full"
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="mt-4">
          <h3 className="block mb-2 font-bold">Select scraping options:</h3>
          <RadioButtonsExample setter={setSelectedOption} getter={selectedOption} />
        </div>

        {/* Error message */}
        {error && <div className="text-red-600 mb-2">{error}</div>}

        {/* Scrape button */}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          onClick={handleScrape}
          disabled={isLoading}
        >
          {isLoading ? "Scraping..." : "Scrape"}
        </button>

        {/* Preview and Download buttons */}
        {isScrapingDone && (
          <div className="flex justify-center gap-4 mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handlePreview}>
              Preview
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                if (scrapedPage) {
                  // downloadFile(scrapedPage, `scraped-${new Date().toISOString().slice(0, 10)}.txt`);
                  downloadFile(scrapedPage, urlInput);
                } else {
                  setError("No content for downloading");
                }
              }}
            >
              Download
            </button>
          </div>
        )}

        {/* Preview area */}
        {showPreview && scrapedPage && (
          <div className="mt-6 w-full">
            <h3 className="font-bold mb-2">
              Preview scraped page for <i>{urlInput}</i>
            </h3>
            <textarea
              value={scrapedPage}
              readOnly
              className="w-full min-h-52 border border-gray-300 rounded p-2 font-mono resize-y"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full bg-blue-600 text-white py-2 text-center text-sm mt-auto">
        &copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project
      </div>
    </div>
  );
};

export default ScrapePage;
