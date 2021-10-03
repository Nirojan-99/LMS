const mongodb = require("mongodb");
const db = require("../db");

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

  //delete the ticket and send reply as mail

  // db.getDb()
  //   .db()
  //   .collection("Tickets")
  //   .findOne({ _id: new mongodb.ObjectId(req.query.ticketID) })
  //   .then((resp) => {
  //     res.status(200).json(resp);
  //   })
  //   .catch((er) => {
  //     console.log(er);
  //   });
};
