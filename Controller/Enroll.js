const mongodb = require("mongodb");

const db = require("../db");

// post request
// get enrollcount
exports.EnrollCount = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Enroll")
    .findOne({ id: req.body.moduleId })
    .then((resp) => {
      // if (!resp) {
      //   res.status(200).json({ enrollcount: false });
      // } else {
      res.status(200).json(resp);

      // res.status(200).json(resp);

      // console.log(resp);

      // res.status(200);
    })
    .catch((er) => {
      console.log(er);
    });
};
exports.EnrollStatus = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Enroll")
    .findOne({ id: req.query.moduleid, students: req.query.ID })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false });
    });
};

exports.GetEnroll = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Enroll")
    .findOne({ id: req.query.id })
    .then((resp) => {
      if (resp) {
        const idArray = resp.students.map((row) => {
          return new mongodb.ObjectId(row);
        });
        db.getDb()
          .db()
          .collection("User")
          .find({ _id: { $in: idArray } })
          .toArray()
          .then((res1) => {
            if (res1) {
              res.status(200).json(res1);
            } else {
              res.status(200).json({ ack: false });
            }
          });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false });
    });
};
