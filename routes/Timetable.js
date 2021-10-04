const Router = require("express").Router;
const router = Router();
const fileUpload = require("express-fileupload");
const db = require("../db");
const mongodb = require("mongodb");

router.use(fileUpload());

router.post("/add_timetable", (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  if (req.files) {
    let tt = req.files.file;
    const fileName = req.body.title + tt.name;

    tt.mv("TimeTable/" + fileName, (error) => {
      if (error) {
        console.log(error);
      } else {
        const link = "http://localhost:5000/TimeTable/" + fileName;

        db.getDb()
          .db()
          .collection("TimeTable")
          .insertOne({ title: req.body.title, link: link })
          .then((resp) => {
            if (resp.insertedId) {
              res.status(200).json({ created: true });
            } else {
              res.status(200).json({ created: false });
            }
          })
          .catch(() => {
            res.status(200).json({ created: false });
          });
      }
    });
  }
});

router.get("/get_timetables", (req, res, next) => {
  db.getDb()
    .db()
    .collection("TimeTable")
    .find()
    .toArray()
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(200).json({ fetch: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ fetch: false });
    });
});

router.delete("/delete_timetable", (req, res, next) => {
  db.getDb()
    .db()
    .collection("TimeTable")
    .deleteOne({_id: new mongodb.ObjectId(req.query.ID)})
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({deleted:true});
      } else {
        res.status(200).json({ deleted: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ deleted: false });
    });
});

module.exports = router;
