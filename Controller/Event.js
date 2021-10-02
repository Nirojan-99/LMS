const mongodb = require("mongodb");
const db = require("../db");

exports.GetEvent = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Event")
    .find({ $or: [{ creator: req.query.userID }, { type: "admin" }] })
    .sort({ date: 1 })
    .toArray()
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ available: false, msg: er });
    });
};

exports.AddEvent = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Event")
    .insertOne(req.body)
    .then((resp) => {
      if (resp.insertedId) {
        res.status(200).json({ inserted: true });
      } else {
        res.status(200).json({ inserted: false });
      }
    })
    .catch(() => {
      res.status(200).json({ inserted: false });
    });
};

exports.DeleteEvent = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query._id.length !== 24) {
    res.status(200).json({ deleted: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Event")
    .deleteOne({ _id: new mongodb.ObjectId(req.query._id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ deleted: true });
      } else {
        res.status(200).json({ deleted: false });
      }
    })
    .catch(() => {
      res.status(200).json({ deleted: false });
    });
};
