import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { BASE_URL } from "../api/globalvariables";
import { useNavigate } from "react-router-dom";

import { downloadFile } from "../api/axios";


interface HistoryRecord {
  url: string;
  scrape_method?: string;  
  scraping_method?: string; 
  scraped_data: string;
  date: string;
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      console.log("Token stored:", token ? token.substring(0, 15) + "..." : "No token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Test the token validity with the /auth endpoint first
      try {
        const authTest = await axios({
          method: "get",
          url: `${BASE_URL}/auth`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Auth test successful:", authTest.data);
      } catch (authErr) {
        console.error("Auth test failed:", authErr);
        throw new Error("Token validation failed");
      }

      const response = await axios({
        method: "get",
        url: `${BASE_URL}/history`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      
      
      setHistory(response.data);
      setError(null);
    } catch (err) {
      console.error("Detailed error:", err);

      if (axios.isAxiosError(err) && err.response) {
        console.log("Status:", err.response.status);
        console.log("Headers:", err.response.headers);
        console.log("Data:", err.response.data);
      }

      if (err instanceof Error) {
        setError(`Failed to load history: ${err.message}`);
      } else {
        setError("Failed to load history: An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get the scraping method, works with multiple field names
  const getScrapingMethod = (record: HistoryRecord): string => {
    return record.scrape_method || record.scraping_method || "Unknown";
  };

  
  const getMethodStyle = (method: string | undefined): string => {
    if (!method) return 'bg-gray-100 text-gray-800';
    
    switch (method.toLowerCase()) {
      case 'requests':
        return 'bg-green-100 text-green-800';
      case 'bs4':
        return 'bg-blue-100 text-blue-800';
      case 'selenium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="w-full bg-blue-600 text-white py-6">
        <h1 className="text-3xl font-bold text-center mb-2">Web Scraping Made Simple</h1>
        <h2 className="text-lg text-center">Extract and clean web data</h2>
      </div>

      <div className="w-full px-8 py-6 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Your Scraping History</h2>
          <Navbar />
        </div>
        
        <div className="mt-6">
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading your history...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <button 
                onClick={fetchHistory} 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-600 mb-4">No scraping history found.</p>
              <p className="text-gray-600">Start scraping to see your records here!</p>
              <button 
                onClick={() => navigate('/')} 
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Go to Scraper
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((record, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-blue-700 text-lg truncate max-w-xs">{record.url}</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {record.date}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className={`text-sm px-3 py-1 rounded-full ${getMethodStyle(getScrapingMethod(record))}`}>
                      Method: {getScrapingMethod(record)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-700 font-mono text-sm overflow-auto h-36">
                      {record.scraped_data.substring(0, 300)}
                      {record.scraped_data.length > 300 && (
                        <span className="text-blue-600">...</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => downloadFile(record.scraped_data, undefined, record.url)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-blue-600 text-white py-3 text-center text-sm mt-auto">
        &copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project
      </div>
    </div>
  );
};

export default HistoryPage;