//we are creating this connectDB because, this js file acts a connection link which controls the connection layer between db and index, suppose we want to take our db from local to global and vice versa, it will be painful to make those changes in files, or suppose we want to change our database from mongodb to mysql, in those kinds of scenarios, this file will have just the connection links so that other files can just call this js file and then use the database

import mongoose from "mongoose"; // imports the library and lets nodejs talik to mondob in a structured way
import dotenv from "dotenv"; //imports dotenv which loads environment variables from any .env file into process.env
// .env files are used to store configurations like database credentials, urls for accessing 3rd party or api keys
//.env files are used to prevent hardcoding on environment specific things
//.config will help our dotenv data available in process.env
//now process.env will contail the env variable

// we are collecting connection string from dotenv so that we dont need to change it in all the places

dotenv.config({ path: "../.env" });
//const connectDB = mongoose.connect(process.env.MONGODB_URI); this will return a promise, so what we do instead is, use async await to collect the promise
//this will read the .env file and put all key value pair in process.env
//now we can access like process.env.MONGODB_URI etc

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    //this asks mongoose to connect to MongoDB using connection string from .env given by process.env here
    //mongoose.connect returns a promise
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log("mongodb connection error :", error.message);
  }
};

export default connectDB;
//exporting this function so that other files like index.js can import and call it
//this file's job is to connect to the database
