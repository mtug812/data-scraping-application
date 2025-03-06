import axios from "axios";

export const sendAxiosRequest = async (url: string, data: object) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const downloadFile = (content: string, filenameOrUrl?: string, url?: string) => {
  try {
    const blob = new Blob([content], { type: "text/plain" });
    const urlBlob = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = urlBlob;

    const currentDate = new Date().toISOString().slice(0, 10);

    if (filenameOrUrl && (filenameOrUrl.startsWith("http://") || filenameOrUrl.startsWith("https://"))) {
      let extractedDomain = filenameOrUrl.replace(/^https?:\/\//, "");
      extractedDomain = extractedDomain.split("/")[0];
      a.download = `${extractedDomain}_scrape_${currentDate}.txt`;
    } else if (filenameOrUrl) {
      a.download = filenameOrUrl;
    } else if (url) {
      let extractedDomain = url.replace(/^https?:\/\//, "");
      extractedDomain = extractedDomain.split("/")[0];
      a.download = `${extractedDomain}_scrape_${currentDate}.txt`;
    } else {
      a.download = `scraped_${currentDate}.txt`;
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(urlBlob);
  } catch (error) {
    console.error("Download error: ", error);
    throw error;
  }
};
export const previewFile = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, { responseType: "blob" });

    const fileText = await response.data.text();
    return fileText;
  } catch (error) {
    console.error("Preview error: ", error);
    throw error;
  }
};

export default sendAxiosRequest;

//
