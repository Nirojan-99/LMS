const mongodb = require("mongodb");
const db = require("../db");

exports.getInsight = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Material_Insight")
    .findOne({ material_id: new mongodb.ObjectId(req.query.materialID) })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.AddInsight = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Material_Insight")
    .findOne({
      material_id: new mongodb.ObjectId(req.body.material_id),
      "students.student": req.body.student,
    })
    .then((resp) => {
      console.log(resp);
      if (resp) {
        res.status(200).json(resp);
      } else {
        db.getDb()
          .db()
          .collection("Material_Insight")
          .updateOne(
            { material_id: new mongodb.ObjectId(req.body.material_id) },
            {
              $addToSet: {
                students: {
                  student: req.body.student,
                  date_time: req.body.date_time,
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
};
