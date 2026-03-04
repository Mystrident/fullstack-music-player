//mongoose : we are using mongo db and nodejs for writing backend right? it will be difficult for us to write code directly on mongodb, so we make use of mongoose for seamless integration between the database and nodejs
// in mongodb also we have queries, so those queries will be very easy to write with the help of mongoose, cuz, mongoose will convert those repeated queries to funcitons for us to use
//so mongoose will give you schemas, models, nicer apis so you work with javascript objects instead of raw mongodb queries

import mongoose from "mongoose"; //importing mongoose so we can define schemas and models
import bcrypt from "bcrypt"; //used for password hashing

const userSchema = new mongoose.Schema({
  //creating a schema, this describes what a User should look like in mongodb,
  name: {
    type: String,
    required: [true, "this is required"],
  },
  emailID: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is requried"],
    minlength: 6,
  },
  avatar: {
    type: String,
    default: "",
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  favourites: [
    {
      id: { type: String, required: true },
      name: String,
      artist_name: String,
      image: String,
      duration: String,
      audio: String,
    },
  ],
});

//pre save function for password
// we need to hash the password before saving it in the database, so that not even the developers know the password

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; //this is a very important line, suppose there is an edit page where we can edit our password, there if we are not modifying password, we should not add another layer of encryption, there should always be only one layer of encryption, if we add 2 layers of encryption, password wont match,

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password, this will return a true or false

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema); //creates a model called User from the schema, this gives us class like objects so we can do User.create(), User.find() etc
export default User;
