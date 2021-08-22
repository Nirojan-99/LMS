const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();

router.post("/add_job", (req, res, next) => {
  if (req.body.edit) {
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
            jobPoster: req.body.jobPoster,
          },
        }
      )
      .then((resp) => {
        res.status(200).json(resp);
        console.log(res);
      })
      .catch(() => {
        console.log("error")
      });

  } else {
    db.getDb()
      .db()
      .collection("Job")
      .insertOne({
        name: req.body.name,
        companyName: req.body.companyName,
        jobDetails: req.body.jobDetails,
        jobPoster: req.body.jobPoster,
      })
      .then((res) => {
        console.log("added");
      })
      .catch(() => {
        console.log("error")
      });

  }
});

router.get("/get_job/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Job")
    .findOne({ _id:new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });

});


router.get("/get_jobs", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Job")
    .find().toArray()
    .then((resp) => {
      // console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });
});


router.post("/delete_job/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Job")
    .deleteOne({_id:new mongodb.ObjectId(req.query.id)})
    .then((resp) => {
      // console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });
});

module.exports = router;
