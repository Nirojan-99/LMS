const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();

router.get("/material/", (req, res, next) => {
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
});

router.post("/add_insight", (req, res, next) => {
  db.getDb()
  .db()
  .collection("Material_Insight")
  .findOne({
    material_id: new mongodb.ObjectId(req.body.material_id),
    "students.student": req.body.student ,
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

  
});


module.exports = router;
