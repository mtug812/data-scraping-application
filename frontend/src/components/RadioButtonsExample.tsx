import { Dispatch, SetStateAction } from "react";
import { RadioOption } from "../const/types";

type RadioButtonsProps = {
  setter: Dispatch<SetStateAction<RadioOption>>;
  getter: string;
};

const RadioButtonsExample: React.FC<RadioButtonsProps> = ({ setter, getter }) => {
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value as RadioOption);
  };

  return (
    <div className="w-full text-left space-y-2">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="options"
          value="requests"
          checked={getter === "requests"}
          onChange={handleOptionChange}
          className="form-radio text-blue-600"
        />
        <span>Requests</span>
      </label>

      <label className="flex items-center space-x-2 cursor-pointer">
        <input 
          type="radio" 
          name="options" 
          value="bs4" 
          checked={getter === "bs4"} 
          onChange={handleOptionChange}
          className="form-radio text-blue-600" 
        />
        <span>Beautiful Soup</span>
      </label>

      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="options"
          value="selenium"
          checked={getter === "selenium"}
          onChange={handleOptionChange}
          className="form-radio text-blue-600"
        />
        <span>Selenium - dynamic websites</span>
      </label>
    </div>
  );
};

export default RadioButtonsExample;