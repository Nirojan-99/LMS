const fileUpload = require("express-fileupload");
const mongodb = require("mongodb");
const db = require("../db");

exports.AddMaterial = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Material")
    .insertOne({
      title: req.body.title,
      visibility: req.body.visibility,
      date_time: req.body.date_time,
      type: req.body.type,
      link: req.body.link,
    })
    .then((res1) => {
      if (res1.insertedId) {
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
            if (resp.modifiedCount === 1) {
                res.status(200).json({ inserted: true });
            }else{
                res.status(200).json({ inserted: false });
            }
          })
          .catch(()=>{
            res.status(200).json({ inserted: false });
          });
      }else{
        res.status(200).json({ inserted: false });
      }
    })
    .catch(() => {
        res.status(200).json({ inserted: false });
    });
};

exports.UpdateAttandance = (req, res, next) => {
  console.log("aa");
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Material")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      { $set: { visibility: req.body.visibility } }
    )
    .then((res1) => {
      if (res1.modifiedCount === 1) {
        res.status(200).json({ updated: true });
      } else {
        res.status(200).json({ updated: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ updated: false });
    });
};

exports.DeleteMaterial = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Material")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((res1) => {
      if (res1.deletedCount === 1) {
        db.getDb()
          .db()
          .collection("Week")
          .updateOne(
            { _id: new mongodb.ObjectId(req.query.week) },
            { $pull: { contents: new mongodb.ObjectId(req.query.id) } }
          )
          .then((res2) => {
            if (res2.modifiedCount === 1) {
              res.status(200).json({ deleted: true });
            } else {
              //   res.status(200).json({ deleted: false });
            }
          })
          .catch((er) => {
            // res.status(200).json({ deleted: false });
          });
      } else {
        res.status(200).json({ deleted: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ deleted: false });
    });
};

exports.AddSubmission = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .insertOne({
      title: req.body.title,
      visibility: req.body.visibility,
      date_time: req.body.date_time,
      type: req.body.type,
      deadlineDate: req.body.deadlineDate,
      deadlineTime: req.body.deadlineTime,
      maxSize: req.body.maxSize,
    })
    .then((res1) => {
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
          res.status(200).json(resp);
        })
        .catch();
    })
    .catch(() => {});
};

exports.EditSubmission = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          title: req.body.title,
          visibility: req.body.visibility,
          date_time: req.body.date_time,
          type: req.body.type,
          deadlineDate: req.body.deadlineDate,
          deadlineTime: req.body.deadlineTime,
          maxSize: req.body.maxSize,
        },
      }
    )
    .then((res1) => {
      res.status(200).json(res1);
    })
    .catch(() => {});
};

exports.EditLink = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          title: req.body.title,
          visibility: req.body.visibility,
          date_time: req.body.date_time,
          type: req.body.type,
          link: req.body.link,
        },
      }
    )
    .then((res1) => {
      res.status(200).json(res1);
    })
    .catch(() => {});
};

exports.AddFiles = (req, res, next) => {
  if (req.files) {
    let fileToUpload = req.files.file;
    const fileName = req.body.week + fileToUpload.name;

    fileToUpload.mv("files/" + fileName, (error) => {
      if (error) {
        console.log(error);
      } else {
        const link = "http://localhost:5000/files/" + fileName;
        if (req.body.edit === "true") {
          db.getDb()
            .db()
            .collection("Material")
            .updateOne(
              { _id: new mongodb.ObjectId(req.body._id) },
              {
                $set: {
                  title: req.body.title,
                  link: link,
                  date_time: req.body.date_time,
                  visibility: req.body.visibility,
                },
              }
            )
            .then((resp) => {
              res.status(200).json(resp);
            })
            .catch(() => {
              console.log("error");
            });
        } else {
          db.getDb()
            .db()
            .collection("Material")
            .insertOne({
              title: req.body.title,
              link: link,
              type: req.body.type,
              date_time: req.body.date_time,
              visibility: req.body.visibility,
            })
            .then((resp) => {
              // res.status(200).json(resp);
              const materialID = resp.insertedId;
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
                  res.status(200).json(resp);
                })
                .catch();
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
      .collection("Material")
      .updateOne(
        { _id: new mongodb.ObjectId(req.body._id) },
        {
          $set: {
            title: req.body.title,
            date_time: req.body.date_time,
            visibility: req.body.visibility,
          },
        }
      )
      .then((resp) => {
        res.status(200).json(resp);
      });
  }
};

exports.EditNotes = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          title: req.body.title,
          visibility: req.body.visibility,
          date_time: req.body.date_time,
        },
      }
    )
    .then((res1) => {
      res.status(200).json(res1);
    })
    .catch(() => {});
};

exports.GetMDate = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .findOne(
      { _id: new mongodb.ObjectId(req.query.materialID) },
      { date_time: 1 }
    )
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
};
