import { createSlice } from "@reduxjs/toolkit"; //createSlice is a  helper which helps us create slices, reducers, and automatically creates actions for us

const uiSlice = createSlice({
  name: "ui", //we have created a slice named uiSlice and have given it an ID= ui, redux will use this id in action types like ui/openAuthModal etc
  initialState: {
    authModalOpen: false, //closed by default
    authMode: "login", //login/signup/forgot and starts in login mode
  },
  reducers: {
    //reducers are functions that change the state, each function receives a current ui state and an action (message + data) and modifies the state
    openAuthModal: (state, action) => {
      state.authModalOpen = true;
      state.authMode = action.payload || "login";
    }, //when openAuthModal action is dispatched , set authModalOpen to true ie open it and do action.payload if provided or login
    //example: dispatch(openAuthModal("signup")); if action.payload="signup" then authMode="signup" or if
    // dispatch(openAuthModal()), action.payload=undefined therefore fallback to actionMode="login", so this reducer opens the modal and sets which screen to display either login or signup or forgot

    closeAuthModal: (state, action) => {
      state.authModalOpen = false;
      state.authMode = "login";
      //what this reducer does is modal closes and mode resets to login for NEXT TIME
    },

    switchAuthMode: (state, action) => {
      state.authMode = action.payload;
      //example dispatch(switchAuthMode("forgot")); this will ONLY CHANGE WHAT SCREEN IS SHOWN, ie here action.payload="forgot", thus authMode="forgot", so ui switches from initial LOGIN to FORGOT PASSWORD screen
    },

    //a mistake i keep making, these must be INSIDE the reducers, do not keep them outside arghhh
  },
});

export const { openAuthModal, closeAuthModal, switchAuthMode } =
  uiSlice.actions;

export default uiSlice.reducer;
