import Input from "../common/Input";
import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice";
import "../../css/auth/Login.css";
import axios from "axios"; //if we dont import this , login will fail cuz its used as replacement for fetch

/*import dotenv from "dotenv";
//dotenv.config();                  IMPORTANT: in frontend, react by default injects dotenv, so no need to write it  */

const Login = () => {
  const [emailID, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { authMode } = useSelector((state) => state.ui);
  const isForgot = authMode === "forgot";

  const handleLogin = async (e) => {
    e.preventDefault(); //prevents the default behaviour by react
    dispatch(clearError()); // if any error was present, we clear that error

    if (!validator.isEmail(emailID)) {
      dispatch(setError("please enter a valid email address"));
      return;
    } //we validate whether the entered email id is as per the conditions or not

    if (!password) {
      dispatch(setError("please enter your password"));
      return;
    }

    dispatch(setLoading(true)); // if both email and password are valid and when submit is clicked, setloading is turned on

    try {
      /*const res = await axios.post(`http://localhost:5000/api/auth/login`, {
          email,
          password,
        });*/ //its not a good practice to use localhost, so we use env variables

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          emailID: emailID,
          password: password,
        },
      ); //so we are calling the api and sending our email and password inside it to login

      const data = res.data || {}; // the response which we will getting from that login api is either empty or a valid data response

      dispatch(setUser({ user: data.user, token: data.token })); //we are updating the user state from the received data

      localStorage.setItem("token", data.token);

      dispatch(closeAuthModal());
      console.log("login successful");
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      dispatch(setError(serverMessage || "login failed."));
    }
  };

  const handleForgotPassword = async (e) => {
    if (!forgotEmail) {
      setForgotMsg("Please enter your email");
      return;
    }

    try {
      setForgotMsg("Sending reset link...");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        {
          emailID: forgotEmail,
        },
      );

      setForgotMsg("Reset link sent! Check your email 📧");
    } catch (error) {
      setForgotMsg(
        error?.response?.data?.message || "Failed to send reset email",
      );
    }
  };

  return (
    <div className="login-wrapper">
      <h3 className="login-title">Welcome Back</h3>
      <p className="login-subtitle">Please enter your login details</p>

      <form className="login-form" onSubmit={handleLogin}>
        {!isForgot && (
          <>
            <Input
              value={emailID}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              label={"email address"}
              placeholder={"johndoe@email.com"}
              type="email"
            />

            <Input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label="password"
              placeholder={"Min 6 characters"}
              type="password"
            />
          </>
        )}

        {/*forgot password link */}
        <div className="forgot-wrapper">
          {!isForgot ? (
            <>
              <span
                className="forgot-link"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("forgot"));
                }}
              >
                Forgot Password???
              </span>
              <span
                className="forgot-link"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("signup"));
                }}
              >
                Dont have an account yet? Signup!
              </span>
            </>
          ) : (
            <div className="forgot-box">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your registered email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              {forgotMsg && <p className="forgot-msg">{forgotMsg}</p>}

              <button
                type="button"
                className="forgot-btn"
                onClick={handleForgotPassword}
              >
                Send the reset link
              </button>
            </div>
          )}
        </div>

        {error && <div className="login-error">{error}</div>}

        {!isForgot && (
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            <span>{isLoading ? "Logging in..." : "login"}</span>
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
