const Router = require("express").Router;
const mongodb = require("mongodb");
const fileUpload = require("express-fileupload");
const db = require("../db");
const router = Router();

router.use(fileUpload());

router.post("/add_job", (req, res, next) => {
  if (req.files) {
    let poster = req.files.jobPoster;
    const fileName = req.body.companyName + poster.name;

    poster.mv("uploads/" + fileName, (error) => {
      if (error) {
        console.log(error);
      } else {
        const link = "http://localhost:5000/uploads/" + fileName;
        console.log(req.body.edit);

        if (req.body.edit === "true") {
          db.getDb()
            .db()
            .collection("Job")
            .updateOne(
              { _id: new mongodb.ObjectId(req.body._id) },
              {
                $set: {
                  name: req.body.name,
                  companyName: req.body.companyName,
                  jobDetails: req.body.jobDetails,
                  jobPoster: link,
                },
              }
            )
            .then((resp) => {
              res.status(200).json(resp);
              console.log(res);
            })
            .catch(() => {
              console.log("error");
            });
        } else {
          db.getDb()
            .db()
            .collection("Job")
            .insertOne({
              name: req.body.name,
              companyName: req.body.companyName,
              jobDetails: req.body.jobDetails,
              jobPoster: link,
            })
            .then((resp) => {
              res.status(200).json(resp);
              // console.log("added");
            })
            .catch((er) => {
              console.log(er);
            });
        }
      }
    });
  }
  db.getDb()
    .db()
    .collection("Job")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          name: req.body.name,
          companyName: req.body.companyName,
          jobDetails: req.body.jobDetails,
        },
      }
    )
    .then((resp) => {
      res.status(200).json(resp);
    });
});

router.get("/get_job/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Job")
    .findOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      console.log(resp);
      if (!resp) {
        res.status(200).json({ error: "no jobs at the moment" });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
});

router.get("/get_jobs", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Job")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: "no jobs at the moment" });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "can not get jobs from database" });
    });
});

router.post("/delete_job/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Job")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      // console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });
});

module.exports = router;
