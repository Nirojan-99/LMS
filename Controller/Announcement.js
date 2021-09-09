const db = require("../db");
const mongodb = require("mongodb");

exports.AddAnnouncement = (req, res, next) => {
  if (req.files) {
    let poster = req.files.details;
    const fileName = req.body.date + poster.name;

    poster.mv("announcement/" + fileName, (error) => {
      if (error) {
        console.log(error);
      } else {
        const link = "http://localhost:5000/announcement/" + fileName;
        if (req.body.edit === "true") {
          db.getDb()
            .db()
            .collection("Announcement")
            .updateOne(
              { _id: new mongodb.ObjectId(req.body._id) },
              {
                $set: {
                  subject: req.body.subject,
                  message: req.body.message,
                  author: req.body.author,
                  date: req.body.date,
                  time: req.body.time,
                  link: link,
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
            .collection("Announcement")
            .insertOne({
              subject: req.body.subject,
              message: req.body.message,
              author: req.body.author,
              date: req.body.date,
              time: req.body.time,
              link: link,
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
  } else {
    db.getDb()
      .db()
      .collection("Announcement")
      .updateOne(
        { _id: new mongodb.ObjectId(req.body._id) },
        {
          $set: {
            subject: req.body.subject,
            message: req.body.message,
            author: req.body.author,
            date: req.body.date,
            time: req.body.time,
          },
        }
      )
      .then((resp) => {
        res.status(200).json(resp);
      });
  }
};

exports.GetAnnouncements = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Announcement")
    .find({}, { link: false, message: false })
    .sort({ date: 1 })
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.GetAnnouncement = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Announcement")
    .findOne({ _id: new mongodb.ObjectId(req.query.ID) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.DeleteAnnouncement = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Announcement")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.ID) })
    .then((resp) => {
      if (!resp) {
        // res.status(200).json({ error: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
