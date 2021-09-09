const fileUpload = require("express-fileupload");
const mongodb = require("mongodb");
const db = require("../db");

exports.GetWeek = (req, res, next) => {
    // if (req.auth === false) {
    //   res.status(200).json({ auth: false });
    //   return;
    // }
  db.getDb()
    .db()
    .collection("Week")
    .find({ module: req.query.module })
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

exports.GetMaterials = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.contents) {
    const arr = req.query.contents.split(",");
    const contentID = arr.map((row) => {
      return mongodb.ObjectId(row);
    });

    db.getDb()
      .db()
      .collection("Material")
      .find({ _id: { $in: contentID } })
      .toArray()
      .then((resp) => {
        if (resp) {
          res.status(200).json(resp);
        } else {
          res.status(200).json({ available: false });
        }
      })
      .catch((er) => {
        res.status(200).json({ available: false });
      });
  } else {
    res.status(200).json({ available: false });
  }
};

exports.GetModule = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Week")
    .find({ _id: new mongodb.ObjectId(req.query.week) })
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.GetMaterial = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.materialID.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Material")
    .findOne({ _id: new mongodb.ObjectId(req.query.materialID) })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      res.status(200).json({ fetch: false, msg: er });
    });
};
