import React, { useState, useEffect } from "react";
import { FaRedo } from 'react-icons/fa';

const Captcha = ({ onValidate }) => {
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");

  const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    setCaptcha(randomString.toUpperCase());
    setUserInput("");
  };

  useEffect(() => {
    if (onValidate) {
      onValidate(userInput.toUpperCase() === captcha);
    }
  }, [userInput, captcha, onValidate]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="w-full mt-4 space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Enter Captcha
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex justify-center items-center bg-gray-100 p-2 rounded-md border border-gray-300 font-mono tracking-widest">
          {captcha}
        </div>
        <button
          type="button"
          className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          onClick={generateCaptcha}
        >
          <FaRedo className="text-gray-600" />
        </button>
        <input
          type="text"
          className="flex-1 min-w-0 pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type the code"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Captcha;
