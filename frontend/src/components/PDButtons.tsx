// import React from "react";
// import { useState } from "react";
// import "../stylers/PDButtons.css";


// const PDButtons = () => {

// //const isScrapingDone = true;
//    const [isScrapingDone, setIsScrapingDone] = useState(false)
     
//    const handleScrape = async() => {

//         console.log("Starting scraping...")

//         const response = await fetch("http://localhost:5000/scrape", {   //fetch sends request to backend
//            method: "POST",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify({ url: "https://example.com", option: "scrape1" })
//         });
        
//         const data = await response.json();  //converts response from backend
//         console.log("Answer from Backend:", data);

//         if(response.ok) {
//            setIsScrapingDone(true);
//         }
    

//     return (
    
//         <div>
//             {isScrapingDone && ( //makes sure that the buttons are there if the scraping is finished
//                 <div className="buttonContainer">
//                     <button>Download</button>
//                     <button>Preview</button>
//                 </div>
//             )}
//         </div>
        
        
    
//     )
//     //const [isLoading, setIsLoading] = useState(false)
//     }
// }
// export default PDButtons