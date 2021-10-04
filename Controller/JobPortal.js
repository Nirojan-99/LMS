const db = require("../db");
const mongodb = require("mongodb");
const fileUpload = require("express-fileupload");

exports.GetJobs = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Job")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      res.status(200).json({ error: "can not get jobs from database" });
    });
};

exports.AddJob = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.type === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.files) {
    let poster = req.files.jobPoster;
    const fileName = req.body.companyName + poster.name;

    if (
      poster.mimetype.includes("image/jpeg") &&
      poster.size / (1024 * 1024) < 5
    ) {
      poster.mv("uploads/" + fileName, (error) => {
        if (error) {
          console.log(error);
        } else {
          const link = "http://localhost:5000/uploads/" + fileName;
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
                if (resp.modifiedCount === 1) {
                  res.status(200).json({ uploaded: true });
                } else {
                  res.status(200).json({ uploaded: false });
                }
              })
              .catch(() => {
                res.status(200).json({ uploaded: false });
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
                if (resp.insertedId) {
                  res.status(200).json({ uploaded: true });
                } else {
                  res.status(200).json({ uploaded: false });
                }
              })
              .catch((er) => {
                res.status(200).json({ uploaded: false });
              });
          }
        }
      });
    } else {
      res.status(200).json({ error: true });
    }
  } else {
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
        if (resp.modifiedCount === 1) {
          res.status(200).json({ uploaded: true });
        } else {
          res.status(200).json({ uploaded: false });
        }
      })
      .catch(() => {
        res.status(200).json({ uploaded: false });
      });
  }
};

exports.GetJob = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.id.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Job")
    .findOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ fetch: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log("err");
      res.status(200).json({ fetch: false });
    });
};

exports.DeleteJob = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.type === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.id.length !== 24) {
    res.status(200).json({ deleted: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Job")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ deleted: true });
      } else {
        res.status(200).json({ deleted: false });
      }
    })
    .catch(() => {
      res.status(200).json({ deleted: false });
    });
};
