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

// export const downloadFile = (content: string, filename: string) => {
//   try {
    
//     const blob = new Blob([content], { type: "text/plain" });

    
//     const urlBlob = window.URL.createObjectURL(blob);

    
//     const a = document.createElement("a");
//     a.href = urlBlob;
//     a.download = filename;

    
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);

    
//     window.URL.revokeObjectURL(urlBlob);
//   } catch (error) {
//     console.error("Download error: ", error);
//     throw error;
//   }
// };
export const downloadFile = (content: string, filenameOrUrl?: string, url?: string) => {
  try {
    // Creăm blob-ul pentru conținut
    const blob = new Blob([content], { type: "text/plain" });
    const urlBlob = window.URL.createObjectURL(blob);
    
    // Creăm elementul pentru descărcare
    const a = document.createElement("a");
    a.href = urlBlob;
    
    // Obținem data curentă formatată
    const currentDate = new Date().toISOString().slice(0, 10);
    
    // Stabilim numele fișierului în funcție de parametrii primiți
    if (filenameOrUrl && (filenameOrUrl.startsWith('http://') || filenameOrUrl.startsWith('https://'))) {
      // Al doilea parametru pare a fi un URL, procesează-l ca atare
      let extractedDomain = filenameOrUrl.replace(/^https?:\/\//, "");
      extractedDomain = extractedDomain.split("/")[0];
      a.download = `${extractedDomain}_scrape_${currentDate}.txt`;
    } else if (filenameOrUrl) {
      // Al doilea parametru este un nume de fișier custom - îl folosim direct
      a.download = filenameOrUrl;
    } else if (url) {
      // Folosește al treilea parametru ca URL
      let extractedDomain = url.replace(/^https?:\/\//, "");
      extractedDomain = extractedDomain.split("/")[0];
      a.download = `${extractedDomain}_scrape_${currentDate}.txt`;
    } else {
      // Fallback - doar data
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
