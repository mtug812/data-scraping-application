/**
 * Creates a .txt file from the given text content and triggers a download.
 *
 * @param {string} text 
 * @param {string} filename 
 */
export function downloadAsTxt(text:string, filename:string) {
    
  const blob = new Blob([text], { type: 'text/plain' });
  
 
  const url = URL.createObjectURL(blob);

 
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;

  
  anchor.click();

  
  URL.revokeObjectURL(url);
}

//