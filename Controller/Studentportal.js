const fileUpload = require("express-fileupload");
const mongodb = require("mongodb");
const db = require("../db");

exports.getGPA = (req, res, next) => {
  if (!req.query.GPA) {
    res.status(200).json({ fetched: false });
    return;
  }

  db.getDb()
    .db()
    .collection("GPA")
    .findOne({ _id: req.query.GPA })
    .then((res1) => {
      if (!res1) {
        res.status(200).json({ fetched: false });
      } else {
        res.status(200).json(res1);
      }
    })
    .catch((er) => {
      res.status(200).json({ fetched: false });
    });
};

exports.AddNewSemester = (req, res, next) => {
  if (!req.body) {
    res.status(200).json({ created: false });
    return;
  }
  db.getDb()
    .db()
    .collection("GPA")
    .updateOne(
      {
        _id: req.body.SID,
      },
      {
        $addToSet: {
          data: {
            year: req.body.year,
            semester: req.body.semester,
          },
        },
      },
      {
        upsert: true,
      }
    )
    .then((res1) => {
      if (res1.upsertedCount === 1 || res1.modifiedCount === 1) {
        res.status(200).json({ created: true });
      } else {
        res.status(200).json({ created: false, error: "Data already exist" });
      }
    })
    .catch((er) => {
      res.status(200).json({ created: false });
    });
};

exports.UpdateGPA = (req, res, next) => {
  if (!req.body) {
    res.status(200).json({ created: false });
    return;
  }


  db.getDb()
    .db()
    .collection("GPA")
    .updateOne(
      {
        _id: req.body.SID,
        data: {
          $elemMatch: { year: req.body.year, semester: req.body.semester },
        },
      },
      {
        $set: {
          "data.$.GPA": req.body.GPA,
          "data.$.status": req.body.status,
        },
      }
    )
    .then((res1) => {
      if (res1.modifiedCount === 1) {
        res.status(200).json({ created: true });
      } else {
        res.status(200).json({ created: false, error: "Data already exist" });
      }
    })
    .catch((er) => {
      console.log(er);
      res.status(200).json({ created: false });
    });
};
