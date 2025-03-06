import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { BASE_URL } from "../api/globalvariables";
import { useNavigate } from "react-router-dom";

import { downloadFile } from "../api/axios";

interface HistoryRecord {
  url: string;
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

      console.log("Response received:", response);
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

  return (
    <div className="history-page min-h-screen bg-gray-100 p-4 flex flex-col items-center pt-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Scraping History</h1>

      <Navbar />

      <div className="w-full max-w-4xl mt-8">
        {loading ? (
          <div className="text-center">Loading your history...</div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button onClick={fetchHistory} className="bg-blue-500 text-white px-4 py-2 rounded">
              Try Again
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center">No scraping history found. Start scraping to see your records here!</div>
        ) : (
          <div className="history-list">
            {history.map((record, index) => (
              <div key={index} className="history-item bg-white p-4 rounded shadow mb-4">
                <div className="history-header flex justify-between items-center mb-2">
                  <h3 className="font-bold">{record.url}</h3>
                  <span className="text-sm text-gray-500">{record.date}</span>
                </div>

                <div className="history-content mb-2">
                  <textarea
                    readOnly
                    value={record.scraped_data.substring(0, 200) + (record.scraped_data.length > 200 ? "..." : "")}
                    className="w-full h-20 p-2 bg-gray-50 rounded"
                  />
                </div>

                <div className="history-actions">
                  <button
                    onClick={() => downloadFile(record.scraped_data, undefined, record.url)}
                    className="download-btn bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
