//anytime we are gonna talk with database, it will take some time to respond, so we will use async await
import User from "../models/userModel.js"; //This pulls in your Mongoose model.
import imagekit from "../config/imagekit.js"; //This is your cloud image uploader. Instead of storing images inside MongoDB (which would be chaotic and inefficient), you upload to ImageKit and store only the URL.
import jwt from "jsonwebtoken"; //This library creates and verifies JSON Web Tokens. A JWT is a signed string that proves identity.
import dotenv from "dotenv";
import crypto from "crypto";
import sendMail from "../utils/sendEmail.js";
//IMPORTANT: req, res cycle functions are stateless, so it doesnt store any information, so if we refresh the page, its gone, so what we need to do instead is we have to somehow store the login info inside the BROWSER itself so that everytime we refresh or close and reopen, it remembers its us and goes in, this is usually done using tokens/cookies
//so simply, token is required to access the protected routes, protected routes are those pages which can only be accessed when we are loged in, tokens are encrypted info of the user

dotenv.config();

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); //This creates a signed token containing the user’s ID.
  //Important: the payload { id: userId } is visible if decoded. It is signed, not encrypted. Signing prevents tampering.
};

const signup = async (req, res) => {
  //THIS IS AN EXPRESS ROUTE HANDLER
  //defines a function called as signup that takes req object (stuff sent by client) and response (what we send back), this is an express route handler
  try {
    //const data = req.body; //this is a json body sent by the client and is stored in data

    //getting the data from frontend or postman

    const { name, emailID, password, avatar } = req.body;

    //checking if the data is correct or not
    if (!name || !emailID || !password) {
      return res
        .status(400)
        .json({ message: "Name,EmailID and Password are required" });
    }

    const existingUser = await User.findOne({ emailID }); //checking whether user exists or not using the function provided by mongoose on the model

    if (existingUser) {
      return res.status(400).json({ message: "User exists" });
    }

    let avatarUrl = "";
    if (avatar) {
      //If avatar exists, you upload to ImageKit.
      //imagekit.upload() returns an object.
      //You grab uploadResponse.url.
      const uploadResponse = await imagekit.upload({
        file: avatar,
        fileName: `avatar_${Date.now()}`,
        folder: "/mern-music-player", //tells image kit where to store it inside image kit
      });

      /*{
  url: "https://ik.imagekit.io/your_account/mern-music-player/avatar_1709500000000.jpg",
  fileId: "...",
  name: "...",
  size: ...,
  ...

  uploadResponse.url

That’s the public URL you store in MongoDB.
}*/

      avatarUrl = uploadResponse.url;

      /*const { url } = uploadResponse;
This is object destructuring.
“Take the url property from uploadResponse and create a variable called url.”
So now you would have:
url = "https://ik.imagekit.io/.../avatar_123.jpg"
Both are perfectly valid JavaScript.*/
    }

    //if there is no user, then we have to create a user

    const user = await User.create({
      name,
      emailID: emailID,
      password, //password will be hashed using pre save hook
      avatar: avatarUrl,
    });

    const token = createToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id, //_id because primary key
        name: user.name,
        emailID: user.emailID,
        avatar: user.avatar,
      }, //id is stored as _id
      token,
    });
  } catch (error) {
    console.error("Signup not successful");
    res.status(500).json({ message: "Signup error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailID, password } = req.body; //extract email id and password
    if (!emailID || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ emailID });
    if (!user) {
      return res.status(400).json({ message: "Email id does not exist" });
    }

    const isMatch = await user.comparePassword(password); //This must be a method defined in your model. It likely uses bcrypt.compare() to match raw password with hashed password.
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      message: "User login successful",
      user: {
        id: user._id,
        name: user.name,
        emailID: user.emailID,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("login not successful");
    res.status(500).json({ message: "login error", error: error.message });
  }
};

//protected controller

const getme = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  res.status(200).json(req.user);
};

const forgotPassword = async (req, res) => {
  try {
    const { emailID } = req.body;
    if (!emailID)
      return res.status(400).json({ message: "Email is required " });

    const user = await User.findOne({ emailID });
    if (!user) return res.status(404).json({ message: "No user found" });

    //generate a random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    //hash the token before saving, this line of code is available in their docs

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken; /*Why not store the raw token?

Because if your database gets hacked, the attacker would see valid reset tokens and instantly reset passwords.

By storing only the hashed version, the attacker sees useless scrambled data.*/
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //10mins in milliseconds from current date(date.now)

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      to: user.emailID,
      subject: "Reset your password",
      html: `
      <h3>Password Reset</h3>
      <p>Click on the link below to reset your password</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 10 minutes</p>      `,
    });

    res.status(200).json({ message: "Password reset mail has been sent" });
  } catch (error) {
    console.error("Forgot password error: ", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    /*const { token } = req.params;
Suppose the frontend URL is:
/reset-password/abc123token
Then Express route might look like:
POST /reset-password/:token
So req.params.token would be:
abc123token This is the raw reset token sent in the email.*/

    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be of length 6 or more" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() }, //$gt is greater than, provided by mongoose //So this checks: resetPasswordExpires > current time
      resetPasswordToken: hashedToken, //hashed token matches with one derived from url
    });
    if (!user)
      return res.status(400).json({ message: "Token is invalid or expired " });

    user.password = password; //reseting the password after hashing and pre saving hook
    user.resetPasswordToken = undefined; //setting the reset token to undefined
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("reset password error: ", error.message);
    res.status(500).json({ message: "something went wrong" });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "not authenticated" });
    }

    const { name, emailID, avatar, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (name) user.name = name; //only do this if user sent a name, else do nothing to any other fields of data
    if (emailID) user.emailID = emailID; //only do this if user sent a email, else do nothing to any other fields of data

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Both current and new password are required" });
      }

      const isMatch = await user.comparePassword(currentPassword); //this comparePassword is a method we have written inside of usermodel which checks if the password entered matches the hashed password in the db, so what we are doing right now is, asking what the current password is and checking whether the current password entered by the user is the real current password or not

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "Password must be of length greater than or equal to 6",
        });
      }

      user.password = newPassword;
    } //only do this if user sent a newpassword or oldpassword, then check whether the user has sent BOTH new and old password, else do nothing to any other fields of data

    if (avatar) {
      const uploadAvatar = await imagekit.upload({
        file: avatar,
        fileName: `avatar_${userId}_${Date.now()}.jpg`,
        folder: "/mern-music-player",
      });

      user.avatar = uploadAvatar.url; //we know that db doesnt store avatar, so what we do is, send the avatar to imagekit and get the url of imagekit and store that url inside db
    } //only do this if user sent a new avatar, else do nothing to any other fields of data

    await user.save();

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        emailID: user.emailID,
        avatar: user.avatar,
      },
      message: "profile has been updated successfully",
    });
  } catch (error) {
    console.error("edit profile error : ", error.message);
    res.status(500).json({ message: "error in updating profile" });
  }
};

export { login, signup, getme, forgotPassword, resetPassword, editProfile };
