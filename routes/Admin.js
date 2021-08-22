const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();

router.get("/get_week/", (req, res, next) => {
  // console.log(req.query.module);
  db.getDb()
    .db()
    .collection("Week")
    .find({ module: req.query.module })
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {});
  // console.log(req.body)
});

router.post("/add_material/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .insertOne({
      title: req.body.title,
      visibility: req.body.visibility,
      date_time: req.body.date_time,
      type: req.body.type,
      link:req.body.link
    })
    .then((res1) => {
      // console.log(res.insertedId);
      const materialID = res1.insertedId;
      db.getDb()
        .db()
        .collection("Week")
        .updateOne(
          {
            _id: mongodb.ObjectId(req.body.week),
          },
          { $push: { contents: materialID } }
        )
        .then((resp) => {
          console.log(res);
          res.status(200).json(resp);
        })
        .catch();
    })
    .catch(() => {});
});

router.get("/get_materials/", (req, res, next) => {
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
        console.log(resp);
        console.log("called");
        res.status(200).json(resp);
      })
      .catch((er) => {
        console.log(er);
      });
  }
});

router.get("/get_module/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Week")
    .find({ _id:new mongodb.ObjectId(req.query.week) })
    .toArray()
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

module.exports = router;
