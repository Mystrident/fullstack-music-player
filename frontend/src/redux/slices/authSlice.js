/*GLOSSARY:
    state: app's memory, like who is logged in, what is this token,etc, react's useState gives local state, redux gives global state

    store: single place where all global state lives,only one store per app, every component can read from it, we dont change it directly

    slice: one part of the store, authSlice, musicSlice, etc

    example:
    store = {
        auth: authSliceState,
        music: musicSliceState
    }

    reducer: function that changes the state, but only when an ACTION tells to do it, example 
    loginSuccess(state, action) {
        state.user = action.payload.user;
    }
    when loginsuccess happens, update the user 

    action: a message that says something has happened, "user logged in","login failed"
    with redux, actions are autocreated
    example:
    dispatch(loginSuccess(data)); //when this is done
    //an action like below is sent
    {
        type: "auth/loginSuccess",
        payload: data
    }//so basically action is event + data

    payload: information that we send to update the state

*/

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, //initially no user is logged in
  token: localStorage.getItem("token") || null, //try to read token from browser storage, if not found then set it as null
  isAuthenticated: false, //user is logged in or not
  isLoading: false, //no api calls in progress
  error: null, //no errors initially
};

const authSlice = createSlice({
  name: "auth", //we are creating a slice named auth
  initialState,

  reducers: {
    //set loading state during api calls(login,register,fetchuser)
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null;
    },

    //set user after successful login/register/fetchuser
    //also store token in localstorage for persistence

    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    //clear all auth state and remove token from localstorage
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },

    updateFavourites: (state, action) => {
      if (state.user) {
        state.user.favourites = action.payload;
      }
    },

    clearError: (state, action) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  logout,
  clearError,
  updateFavourites,
  setUser,
} = authSlice.actions; //we have exported these slice actions, now this will be userful for the components

export default authSlice.reducer;
