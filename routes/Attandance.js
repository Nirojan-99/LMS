const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();

router.post("/mark_attandance", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Attandance")
    .findOne({
      "students.student": req.body.studentID,
      attandanceID: req.body.attandanceID,
    })
    .then((resp) => {
      console.log(resp);
      if (resp) {
        res.status(200).json(resp);
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
            res.status(200).json(resp);
          })
          .catch((er) => {
            console.log(er);
          });
      }
    })
    .catch((er) => {
      console.log(er);
    });
});

router.post("/check_attandance", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Attandance")
    .findOne({
      attandanceID: req.body.attandanceID,
      "students.student": req.body.studentID,
    })
    .then((resp) => {
      console.log(resp);
      if (!resp) {
        res.status(200).json({ avalilable: false });
      } else {
        res.status(200).json({ avalilable: true });
      }
    })
    .catch((er) => {
      console.log(er);
    });
});

router.get("/get_attandances", (req, res, next) => {
  
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
      console.log(er);
    });
});

router.post("/get_students", (req, res, next) => {
  // console.log(req.body)
  const studentList = req.body.map((row) => {
    return new mongodb.ObjectId(row.student);
  });
  db.getDb()
    .db()
    .collection("User")
    .find({ _id: { $in: studentList } }, { email: 1 ,_id:0 })
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
});

module.exports = router;
