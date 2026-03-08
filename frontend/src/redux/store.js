/*
redux is a central memory system 
store defines where all the global state lives

redux toolkit provides an easier way to create stores
configureStore automatically:

• sets up reducers
• enables Redux DevTools
• adds middleware

redux is a state machine for the app
state is the data
action is the message saying something happened 
reducer is the rulebook which decides how the state must change when the data arrive 
A reducer is simply a pure function that takes the current state and an action, and returns a new state.

Important detail: reducers do not modify the existing state. They create a new copy with the changes. This immutability rule is what lets Redux track changes efficiently.
*/

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import uiReducer from "./slices/uiSlice.js";
const store = configureStore({
  //Creates the Redux store.
  reducer: {
    //Defines all reducers used in the application.
    auth: authReducer, //Everything related to authentication lives under: state.auth
    ui: uiReducer, //Everything related to ui lives under: state.ui
  },
});

export default store; //Exports the store so React can access it.
