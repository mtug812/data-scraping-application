/**
 * Creates a .txt file from the given text content and triggers a download.
 *
 * @param {string} text - The string content to be downloaded.
 * @param {string} filename - The desired filename (e.g. "myFile.txt").
 */
export function downloadAsTxt(text:string, filename:string) {
    // Create a new Blob object using the text
    const blob = new Blob([text], { type: 'text/plain' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
  
    // Create a temporary anchor element and set the href and download attributes
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
  
    // Programmatically click the anchor to trigger the download
    anchor.click();
  
    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);
  }
