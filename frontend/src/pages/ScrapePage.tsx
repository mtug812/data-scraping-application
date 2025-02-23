import React, { useState } from 'react'; // Importă React și hook-ul useState din bibliotecă
import RadioButtonsExample from '../components/RadioButtonsExample';
import "./ScrapePage.css"
type RadioOption = "scrape1" | "scrape2" | "scrape3";

// Definim un component funcțional TypeScript numit ScrapePage
const ScrapePage: React.FC = () => {
  // Definim o stare urlInput, inițializată cu un string gol, și o funcție setUrlInput pentru a modifica această stare
  const [urlInput, setUrlInput] = useState('');
  
  // Definim o stare error, inițializată cu un string gol, și o funcție setError pentru a modifica această stare
  const [error, setError] = useState('');

  // Funcția asincronă care se ocupă de procesul de "scrape"
  const handleScrape = async () => {
    console.log(selectedOption);
     
    setError(''); // Resetăm eroarea înainte de a începe un nou "scrape"
    // TODO: Aici va fi implementată logica de fetch în viitor (Ticket #4), care va apela un API
    console.log('Scrape triggered for:', urlInput); // Afișăm în consolă mesajul și valoarea urlInput
  };

  

  const [selectedOption, setSelectedOption] = useState<RadioOption>("scrape1");



  // Returnăm structura JSX a componentului
  return (
    // Creăm un container cu clase Tailwind pentru aspect (min-height, background, padding)
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Titlul principal al paginii */}
      <h1 style={{outline:"2px solid blue",width:"100%"}}className="text-2xl font-bold mb-4">Scrape Page {selectedOption}</h1>
      

       {/* Secțiune pentru input-ul unde utilizatorul introduce URL-ul */}
       <div className="mb-2 inputContainer">
        <label className="block mb-1">URL to Scrape:</label>
        <input
          className="border rounded p-2 w-full" // Clase Tailwind pentru stilizare
          type="text"                           // Tipul input-ului este text
          value={urlInput}                      // Valoarea input-ului este urlInput din starea componentului
          onChange={(e) => setUrlInput(e.target.value)} // Actualizează starea când utilizatorul tastează
          placeholder="https://example.com"     // Afișăm un placeholder în cazul în care câmpul e gol
        />
      </div>
      
      <RadioButtonsExample setter={setSelectedOption} getter={selectedOption}/>
     
      

      {/* Afișăm mesajul de eroare dacă există */}
      {error && (
        <div className="text-red-600 mb-2">
          {error}
        </div>
      )}

      {/* Butonul care declanșează funcția handleScrape */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" // Clase de stilizare
        onClick={handleScrape} // Când este apăsat butonul, se execută handleScrape
      >
        Scrape & Download
      </button>

      <footer>
      <p>&copy;{new Date().getFullYear()} DREAM TEAM HOLA AMIGOS</p>
      </footer>

    </div>
  );
};

// Exportăm componenta pentru a putea fi utilizată în alte locuri din aplicație
export default ScrapePage;

//parametri pt onclick +text

//css separat