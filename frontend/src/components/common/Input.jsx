//this is a custom component

import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import "../../css/auth/Input.css";

const Input = ({ value, onChange, label, placeholder, type }) => {
  //a functional react component named Input that receives props
  const [showPassword, setShowPassword] = useState(false); //a local state that is a boolean showPassword initally false(password hidden), this state exists only inside this component

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }; //this flips showPassword state, if it was false it becomes true and vice versa

  return (
    <div className="input-wrapper">
      <label>{label}</label>
      {/*shows whatever label was passed as props, example <input label="password" */}
      <div className="input-container">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type //if type is password and if showpassword is on display text else display it as password else if type is not password, then display the given type like email, text etc
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          className="input-field"
        />
        {type === "password" && ( //render the eye button only if type is password
          <>
            <button type="button" className="input-eye-btn">
              {showPassword ? (
                <FaRegEye size={22} onClick={() => toggleShowPassword()} />
              ) : (
                <FaRegEyeSlash size={22} onClick={() => toggleShowPassword()} />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
