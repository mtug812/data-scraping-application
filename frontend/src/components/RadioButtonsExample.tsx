import { Dispatch, SetStateAction } from "react";
import { RadioOption } from "../const/types";




type RadioButtonsProps = {
  setter: Dispatch<SetStateAction<RadioOption>>; //
  getter: string;
};


const RadioButtonsExample: React.FC<RadioButtonsProps> = ({ setter, getter }) => {

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   setter(event.target.value as RadioOption);
  };

  return (

  
    <div className="scrapeOptionsContainer w-full max-w-md text-left">
      <h3 className="font-bold mb-2">Select scraping options:</h3>
    
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
        Beautiful Soup
      </label>
      <br />

      <label>
        <input
          type="radio"
          name="options"
          value="selenium"
          checked={getter === "selenium"}
          onChange={handleOptionChange}
        />
        Selenium - dynamic websites
      </label>
    </div>
    
    
  );
};

export default RadioButtonsExample;
