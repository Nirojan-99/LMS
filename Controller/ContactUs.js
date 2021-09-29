const mongodb = require("mongodb");
const db = require("../db");

exports.postQuery = (req, res, next) => {
  if (!req.body.data) {
    res.status(200).json({ created: false});
    return;
  }
  db.getDb()
    .db()
    .collection("ContactUs")
    .insertOne(req.body.data)
    .then((res1) => {
      if (res1.insertedId) {
        res.status(200).json({ created: true });
      } else {
        res.status(200).json({ created: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ created: false, msg: er });
    });
};
