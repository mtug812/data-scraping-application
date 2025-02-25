import { Dispatch, SetStateAction } from "react";
import { RadioOption } from "../const/types";



//props de componenta
type RadioButtonsProps = {
  setter: Dispatch<SetStateAction<RadioOption>>; //
  getter: string;
};
// type casting - conversie de la un tip de date la altul
//react functional component <aici ia type declarat sus> 
//
const RadioButtonsExample: React.FC<RadioButtonsProps> = ({ setter, getter }) => {

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   setter(event.target.value as RadioOption);
  };

  return (
    <div style={{background:"gray",padding:"10px",borderRadius:"10px"}}>
      <h3>Selectează o opțiune:</h3>
      <label>
        <input
          type="radio"
          name="options"
          value="requests"
          checked={getter === "requests"}
          onChange={handleOptionChange}
        />
        Requests
      </label>
      <br />

      <label>
        <input
          type="radio"
          name="options"
          value="bs4"
          checked={getter === "bs4"}
          onChange={handleOptionChange}
        />
        BS4
      </label>
      <br />

      <label>
        <input
          type="radio"
          name="options"
          value="scrape3"
          checked={getter === "scrape3"}
          onChange={handleOptionChange}
        />
        C
      </label>
      
      <p>Opțiunea selectată este: {getter.toUpperCase()}</p>
    </div>
  );
};

export default RadioButtonsExample;
