require("dotenv").config()
import nodemailer from "nodemailer"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import path from "path"
import validateInput from "./api/validation"


const port = process.env.PORT || 3000

const app = express()
//required to parse req.body in post request
app.use(bodyParser.urlencoded({ extended: true }))

//Sets acceptable origins for cors
const corsConfig = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200
}

app.post("/contact", cors(corsConfig), verifyOrigin, confirmInput, sendEmail)

//Verifies if the origin of request is from portfolio. If not, ends transaction
function verifyOrigin (req,res, next) {
  const clientOrigin = req.headers.origin
  const permittedOrigins = ["http://localhost:3001"]

  if (permittedOrigins.includes(clientOrigin)) {
    console.log("authorized")
    next()
  } else {
    console.log("not authorized")
    //client will get a cors error so no need to send actual response back
    res.end()
  }
}

//verifies that all form data is valid before calling sendEmail
function confirmInput(req, res, next){
  try {
    const { name, email, message } = req.body
    if(validateInput("name", name) && validateInput("email", email) && validateInput("message", message)){
      console.log("input valid")
      next()
    } else {
      console.log("invalid input")
      res.sendStatus(400)
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(error.responseCode || 500)    
  } 
}

//Called if form input is valid. Gets email and pw from .env and sends form data w/ nodemailer
async function sendEmail(req, res) {
  console.log("send email")
  try {
    //Create an instance of transporter object
    console.log(req.body)
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
    console.log("Message sent: %s", info.messageId)
    res.sendStatus(200)
  } catch (error) {
    console.log("error")
    console.log(error)
    console.log(error.response)
    res.sendStatus(error.responseCode || 500)
  }
}

app.listen(port, () => {
  console.log(`starting server on port: ${port}`)
  console.log("mode: ", process.env.NODE_ENV)
})
