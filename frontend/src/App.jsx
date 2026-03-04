import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ResetPassword from "./components/auth/ResetPassword";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import {
  setLoading,
  setError,
  logout,
  clearError,
  updateFavourites,
  setUser,
} from "./redux/slices/authSlice";
import "./App.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch(); // gives a remote control to redux,so press dispatch and global state changes
  const { token, user } = useSelector((state) => state.auth); //reaches into the redux store and grabs auth slice, then destructures token and user, so that we have two variables like token and user pointing to auth.token and auth.user

  useEffect(() => {
    const storedToken = token || localStorage.getItem("token"); //tries to get token from redux (above destructurig), or if its not there, it goes to localstorage
    if (!storedToken || user) return; //if there is no token at all no point in calling the server, if the user already exists in redux, user is already fetched

    const fetchUser = async () => {
      try {
        dispatch(setLoading(true)); // so ui can show spinning wheel etc
        dispatch(clearError()); //clear any old error messages

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/getMe`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            }, //sends the token in the authorization header
          },
        );

        dispatch(setUser({ user: res.data, token: storedToken })); // if the request succeeds,we store the user data returned by the server and the token we used, now the redux will know the details about the user and then the token used to retrieve that user
      } catch (error) {
        console.error("getMe failed", error);
        dispatch(logout());
        dispatch(
          setError(
            error?.response?.data
              ?.message /*“If error exists, look at error.response”
“If response exists, look at response.data”
“If data exists, look at data.message”
“If at any point something is null or undefined, stop and return undefined instead of crashing”*/ ||
              "session expired, please login again",
          ),
        );
      } finally {
        dispatch(setLoading(false)); //whether success or failure, stops the loading ui
      }
    };

    fetchUser(); //now we run it
  }, [dispatch, token, user]); //we run this when the component mounts, token or user changes

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
