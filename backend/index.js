import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js";
import songRouter from "./routes/songRoutes.js";

dotenv.config(".env"); //file config inside .env file will be brought here using this
const PORT = process.env.PORT || 5001; //whatever inside the file will be getting access through this
const app = express(); //all the computational power of express we are givin to the app, we are creating an express object

//app.use(express.json()); //use is a middleware, whatever request or data that is coming, will be converted to json format data, anythg like arrays objects etc to json format

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true })); //we do this because, base64 increases image size by 33 percent , therefore even a small file size will increase and will cause some RANDOM CORS ISSUE

//connecting to database using the function written inside connectDB.js
connectDB();

/*app.use("/", (req, res) => {
  res.status(200).json({ message: "server is working" });
}); // request and response parameters,based on the request, we will give the response, this is where the logics are written, "/ " means home directory
//these app.get app.use etc are called as ROUTE HANDLERS for a particular directory*/

//app.use means it will respond to all http methdos like get post put delete etc on "/" , if we only wanted like say get, then use app.get

app.use(
  cors({
    origin: "http://localhost:5173", //now only 5173 frontend can access our backend
    credentials: true,
  }),
); //this will set priority like which frontend can access my backend, cuz like insta frontend cannot access my bank account backend, that is the principle of cors, so whatever react frontend code that we will be writing, only that can access my backend

app.use("/api/auth", router);

app.use("/api/songs", songRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); //the port value might change from local to deployment, so 5000 say wont be static, so we create a .env file and if we make changes there in that dot env file, it will get reflected everywhere, and these are secured because env files are never put in github, they are put in gitignore

//CORS check that out
