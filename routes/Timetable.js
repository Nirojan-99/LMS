const Router = require("express").Router;
const router = Router();
const fileUpload = require("express-fileupload");
const db = require("../db");

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

module.exports = router;
