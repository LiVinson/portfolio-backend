require("dotenv").config()
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
import cors from "cors"
const path = require("path");
import validateInput from "./api/validation"

const port = process.env.PORT || 3000

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

//Sets acceptable origins for cors
const corsConfig = {
  origin: ["https://www.lisavinson.com", "http://www.lisavinson.com"],
  optionsSuccessStatus: 200
}

// //When user submits contact form, confirm data again, and send email
app.post("/contact", cors(corsConfig), verifyOrigin, confirmInput, sendEmail)

//Verifies if the origin of request is from portfolio. If not, ends transaction
function verifyOrigin (req,res, next) {
  const clientOrigin = req.headers.origin
  const permittedOrigins = ["https://www.lisavinson.com", "http://www.lisavinson.com"]

  if (permittedOrigins.includes(clientOrigin)) {
    
    next()
  } else {
    
    res.end()
  }
}

//verifies that all form data is valid before calling sendEmail
function confirmInput(req, res, next){

  try {
    const { name, email, message } = req.body
    if(validateInput("name", name) && validateInput("email", email) && validateInput("message", message)){
      next()
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    res.sendStatus(error.responseCode || 500)    
  } 
}


//Called if form input is valid. Gets email and pw from .env and sends form data w/ nodemailer
async function sendEmail(req, res) {
  try {
    //Create an instance of transporter object
    const { name, email, message } = req.body
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME, //
        pass: process.env.EMAIL_PASSWORD, //
      },
    })

    const mailOptions = {
      from: email, // sender address
      to: process.env.EMAIL_USERNAME, // list of receivers
      subject: `${name} visited your portfolio!`, // Subject line
      text: email + " sent the following: \n" + message, // plain text body
    }

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(error.responseCode || 500)
  }
}

app.listen(port, () => { 
  console.log("mode: ", process.env.NODE_ENV)
})
