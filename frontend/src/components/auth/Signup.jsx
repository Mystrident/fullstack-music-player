import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice";
import Input from "../common/Input";
import { CiUser } from "react-icons/ci";
import axios from "axios";
import "../../css/auth/Signup.css";
import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const [fullname, setFullName] = useState("");
  const [emailID, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error } = useSelector((state) => state.auth);

  //avatar states
  const [previewImage, setPreviewImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED");
    dispatch(clearError());

    if (!fullname || !emailID || !password) {
      dispatch(setError("please fill all the fields"));
      return;
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        {
          name: fullname,
          emailID: emailID,
          password: password,
          avatar: base64Image ? base64Image : undefined,
        },
      );

      const data = res.data || {};
      dispatch(
        setUser({
          user: data.user,
          token: data.token,
        }),
      );

      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("signup successful");
    } catch (error) {
      console.log("Signup error:", error.response?.data || error.message);
      const serverMessage = error?.response?.data?.message;
      dispatch(setError(serverMessage || "signup failed...try again!"));
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="signup-wrapper">
      <h3 className="signup-title">Create an account</h3>
      <p className="signup-subtitle">Join us today by entering the details</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <div className="profile-image-container">
            {previewImage ? (
              <img src={previewImage} alt="avatar" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                <CiUser size={40} />
              </div>
            )}

            <label className="image-upload-icon">
              📸
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          <Input
            label={"name"}
            type={"text"}
            placeholder={"enter your name"}
            value={fullname}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />

          <Input
            label={"emailID"}
            type={"text"}
            placeholder={"enter your email"}
            value={emailID}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <Input
            label={"password"}
            type={"password"}
            placeholder={"enter your password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <span
            className="forgot-link"
            onClick={() => {
              dispatch(clearError());
              dispatch(switchAuthMode("login"));
            }}
          >
            Do you already have an account???
          </span>
          {error && <div className="signup-error">{error}</div>}

          <div className="signup-actions">
            <button
              className="signup-btn-submit"
              disabled={isLoading}
              type="submit"
            >
              <span>{isLoading ? "signing in" : "signup"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
