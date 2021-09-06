const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();

router.post("/add_ticket", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Tickets")
    .insertOne(req.body)
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

router.get("/get_tickets", (req, res, next) => {
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
});

router.get("/get_ticket/", (req, res, next) => {
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
});

router.delete("/delete_tcket/", (req, res, next) => {
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
});

router.post("/send_reply", (req, res, next) => {
  res.status(200).json({done:true});

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
});

module.exports = router;
