const mongodb = require("mongodb");
const db = require("../db");

exports.CheckAttandance = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.studentID.length !== 24 || req.query.attandanceID.length !== 24) {
    res.status(200).json({ valid: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Attandance")
    .findOne({
      attandanceID: req.query.attandanceID,
      "students.student": req.query.studentID,
    })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ avalilable: false });
      } else {
        res.status(200).json({ avalilable: true });
      }
    })
    .catch((er) => {
      res.status(200).json({ avalilable: true });
    });
};

exports.MarkAttandance = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Attandance")
    .findOne({
      "students.student": req.body.studentID,
      attandanceID: req.body.attandanceID,
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ updated: true });
      } else {
        db.getDb()
          .db()
          .collection("Attandance")
          .updateOne(
            { attandanceID: req.body.attandanceID },
            {
              $addToSet: {
                students: {
                  student: req.body.studentID,
                  date_time: req.body.date_time,
                  studentName: req.body.studentName,
                },
              },
            },
            { upsert: true }
          )
          .then((resp) => {
            if (resp.modifiedCount === 1) {
              res.status(200).json({ updated: true });
            } else {
              res.status(200).json({ updated: false });
            }
          })
          .catch((er) => {
            res.status(200).json({ updated: false });
          });
      }
    })
    .catch((er) => {
      res.status(200).json({ updated: false });
    });
};

exports.GetAttandees = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Attandance")
    .findOne({
      attandanceID: req.query.ID,
    })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ avalilable: false });
      } else {
        res.status(200).json(resp.students);
      }
    })
    .catch((er) => {
      res.status(200).json({ avalilable: false });
    });
};

exports.getStudents = (req, res, next) => {
  const studentList = req.body.map((row) => {
    return new mongodb.ObjectId(row.student);
  });
  db.getDb()
    .db()
    .collection("User")
    .find({ _id: { $in: studentList } }, { email: 1, _id: 0 })
    .toArray()
    .then((resp) => {
      if (!resp) {
        // res.status(200).json({ avalilable: false });
      } else {
        res.status(200).json(resp.name);
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
