const mongodb = require("mongodb");
const db = require("../db");
const nodemailer=require('nodemailer');



// const sendEmail = (otp,email) => {
//   const h1 = "<h2>OTP for reset password</h2><hr>";
//   const h2 = h1 + "<h3>OTP: " + otp + "</h3>";

//   var transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "project2020sliit@gmail.com",
//       pass: "sliit2020",
//     },
//   });


const sendEmail = (otp,email) => {
  const h1 = "<h2>OTP for reset password</h2><hr>";
  const h2 = h1 + "<h3>OTP: " + otp + "</h3>";

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "project2020sliit@gmail.com",
      pass: "sliit2020",
    },
  });

  var mailOptions = {
    from: "project2020sliit@gmail.com",
    to: email,
    subject: "OTP",
    html: h2,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      // return false
    } else {
      console.log("Email sent: " + info.response);
      // return true
    }
  });
};

exports.AddTicket = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Tickets")
    .insertOne(req.body)
    .then((resp) => {
      if (resp.insertedId){
        res.status(200).json({ack:true})
      }else{
        res.status(200).json({ack:false})
      }
    })
    .catch((er) => {
      res.status(200).json({ack:false})
    });
};

exports.GetTickets = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Tickets")
    .find()
    .sort({ date_time: 1 })
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.GetTicket = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Tickets")
    .findOne({ _id: new mongodb.ObjectId(req.query.ticketID) })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.DeleteTicket = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Tickets")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.ticketID) })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.SendReply = (req, res, next) => {
  res.status(200).json({ done: true });

  

  db.getDb()
    .db()
    .collection("Tickets")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.ticketID) })
    .then((resp) => {
      res.status(200).json({});
    })
    .catch((er) => {
      console.log(er);
    });
};
