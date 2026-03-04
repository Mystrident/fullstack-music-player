import nodemailer from "nodemailer"; //This pulls in the Nodemailer library. Nodemailer is a Node.js package that knows how to talk to mail servers using SMTP (Simple Mail Transfer Protocol).
import dotenv from "dotenv";

dotenv.config(); //Load the variables from my .env file into memory.

const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    //A transporter is the mail-sending engine. It contains the configuration for which mail server to connect to and how to authenticate.
    host: process.env.MAILTRAP_HOST, //This is the mail server address, this points to Mailtrap’s SMTP server.
    port: process.env.MAILTRAP_PORT, //This is the port number the SMTP server listens on.
    auth: {
      //SMTP servers don’t let random strangers send mail.
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  await transporter.sendMail({
    //await pauses execution until the email is sent (or fails). Since this is async, it won’t block the whole server — just this function.
    from: "hello@musicapp.com",
    to,
    subject,
    html,
  });
};

export default sendMail; //This makes your function available to other files.
