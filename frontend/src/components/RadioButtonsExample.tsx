import { Dispatch, SetStateAction } from "react";
import { RadioOption } from "../const/types";

type RadioButtonsProps = {
  setter: Dispatch<SetStateAction<RadioOption>>;
  getter: string;
  cleanData: boolean;
  setCleanData: Dispatch<SetStateAction<boolean>>;
  companyName: string;
  setCompanyName: Dispatch<SetStateAction<string>>;
};

const RadioButtonsExample: React.FC<RadioButtonsProps> = ({ 
  setter, 
  getter, 
  cleanData, 
  setCleanData,
  companyName,
  setCompanyName 
}) => {
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
      
      {/* Clean data checkbox */}
      {(getter === "bs4" || getter === "selenium") && (
        <label className="flex items-center space-x-2 cursor-pointer mt-4 border-t pt-4 border-gray-200">
          <input
            type="checkbox"
            checked={cleanData}
            onChange={(e) => setCleanData(e.target.checked)}
            className="form-checkbox text-blue-600 h-5 w-5"
          />
          <span>Clean the data</span>
        </label>
      )}
      
      {/* Company name input for Selenium */}
      {getter === "selenium" && (
        <div className="mt-4 border-t pt-4 border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name (required for Selenium)
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}
    </div>
  );
};

export default RadioButtonsExample;