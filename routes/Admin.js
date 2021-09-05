const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();
const fileUpload = require("express-fileupload");

router.use(fileUpload());

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
      link: req.body.link,
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
        // console.log(resp);
        // console.log("called");
        res.status(200).json(resp);
      })
      .catch((er) => {
        console.log(er);
      });
  } else {
    res.status(200).json({ msg: "no materials" });
  }
});

router.get("/get_module/", (req, res, next) => {
  console.log(req.body.week);
  db.getDb()
    .db()
    .collection("Week")
    .find({ _id: new mongodb.ObjectId(req.query.week) })
    .toArray()
    .then((resp) => {
      // console.log(resp);
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

router.get("/get_material/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .findOne({ _id: new mongodb.ObjectId(req.query.materialID) })
    .then((resp) => {
      // console.log(resp);
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

router.post("/update_attandance/", (req, res, next) => {
  console.log(req.body);
  db.getDb()
    .db()
    .collection("Material")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      { $set: { visibility: req.body.visibility } }
    )
    .then((res1) => {
      console.log("called");
      console.log(res1);
      res.status(200).json(res1);
    })
    .catch((er) => {
      console.log(er);
    });
});

router.post("/delete_material/", (req, res, next) => {
  console.log(req.body);
  db.getDb()
    .db()
    .collection("Material")
    .deleteOne({ _id: new mongodb.ObjectId(req.body.id) })
    .then((res1) => {
      db.getDb()
        .db()
        .collection("Week")
        .updateOne(
          { _id: new mongodb.ObjectId(req.body.week) },
          { $pull: { contents: new mongodb.ObjectId(req.body.id) } }
        )
        .then((res2) => {
          res.status(200).json(res2);
        })
        .catch((er) => {
          console.log(er);
          res.status(200).json({ error: "can not delete from week" });
        });
    })
    .catch((er) => {
      console.log(er);
      res.status(200).json({ error: "can not delete from material" });
    });
});

router.post("/add_submission/", (req, res, next) => {
  // console.log(req.body);
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
          // console.log(res);
          res.status(200).json(resp);
        })
        .catch();
    })
    .catch(() => {});
});

router.post("/edit_submission/", (req, res, next) => {
  // console.log(req.body);
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
});

router.post("/edit_link/", (req, res, next) => {
  // console.log(req.body);
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
});

router.post("/add_file/", (req, res, next) => {
  // console.log(req.body);
  // console.log(req.files);
  if (req.files) {
    let fileToUpload = req.files.file;
    const fileName = req.body.week + fileToUpload.name;

    fileToUpload.mv("files/" + fileName, (error) => {
      if (error) {
        console.log(error);
      } else {
        const link = "http://localhost:5000/files/" + fileName;
        if (req.body.edit === "true") {
          console.log("called");
          console.log(typeof(req.body._id));
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
              console.log(res);
            })
            .catch(() => {
              console.log("error");
            });
        } else {
          console.log("called here");
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
                  // console.log(res);
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
    console.log("edit without file")
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
});

router.post("/edit_notes/", (req, res, next) => {
  // console.log(req.body);
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
});

router.get("/get_material/date/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .findOne({ _id: new mongodb.ObjectId(req.query.materialID) },{date_time:1})
    .then((resp) => {
      // console.log(resp);
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

module.exports = router;
