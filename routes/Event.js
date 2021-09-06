const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();

router.post("/get_events", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Event")
    .find({ $or: [{ creator: req.body.userID }, { type: "admin" }] })
    .sort({ date: 1})
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });
});

router.post("/add_event", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Event")
    .insertOne(req.body)
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });
});

router.post("/delete_event", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Event")
    .deleteOne({ _id: new mongodb.ObjectId(req.body._id) })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });
});

module.exports = router;
