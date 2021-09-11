const Router = require("express").Router;
const mongodb = require("mongodb");

const db = require("../db");
const router = Router();

router.post("/addModule", (req, res, next) => {
  console.log(req.body.data);
  db.getDb()
    .db()
    .collection("Module")
    .insertOne(req.body.data)
    .then((resp) => {
      const courseID = resp.insertedId;
      console.log(req.body.courseID);
      db.getDb()
        .db()
        .collection("course")
        .updateOne(
          {
            _id: mongodb.ObjectId(req.body.courseID),
          },
          { $push: { modules: courseID } }
        )
        .then((resp) => {
          console.log(resp);
          res.status(200).json(resp);
        })
        .catch(() => {});
    })
    .catch((er) => {
      console.log(er);
    });
});

router.get("/get_Modules/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .find({
      year: req.query.year,
      semester: req.query.semester,
      courseID: req.query.courseID,
    })
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: "no Module at the moment" });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "can not get Module from database" });
    });
});

router.get("/get_Module/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .findOne({
      _id: new mongodb.ObjectId(req.query.moduleID),
    })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: "no Module at the moment" });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "can not get Module from database" });
    });
});

router.post("/delete_Module", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .deleteOne({ _id: new mongodb.ObjectId(req.body._id) })
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

router.post("/UpdateModule", (req, res, next) => {
  console.log(req.body);
  db.getDb()
    .db()
    .collection("Module")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          Modulename: req.body.Modulename,
          ModuleCode: req.body.ModuleCode,
          ModuleEnrollmentkey: req.body.ModuleEnrollmentkey,
          ModuleWeekCounts: req.body.ModuleWeekCounts,
          ModuleLectureIncharge: req.body.ModuleLectureIncharge,
        },
      }
    )

    .then((resp) => {
      res.status(200).json(resp);
      console.log(resp);
    })
    .catch(() => {
      console.log("error");
    });
});

router.get("/get_LIC/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .findOne({ _id: new mongodb.ObjectId(req.query.moduleID) })
    .then((resp) => {
      res
        .status(200)
        .json({ LIC: resp.ModuleLectureIncharge, name: resp.Modulename });
    })
    .catch((er) => {
      console.log(er);
    });
});

router.post("/enroll/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .findOne({
      _id: new mongodb.ObjectId(req.body.moduleID),
      ModuleEnrollmentkey: req.body.key,
    })
    .then((resp) => {
      console.log(resp);
      if (resp) {
        db.getDb()
          .db()
          .collection("Enroll")
          .updateOne(
            { id: req.body.moduleID, name: req.body.name },
            { $addToSet: { students: req.body.studentID } },
            { upsert: true }
          )
          .then((resp) => {
            if (resp.modifiedCount === 1 || resp.upsertedCount === 1) {
              res.status(200).json({ ack: true });
            } else {
              res.status(200).json({ ack: false });
            }
          })
          .catch((er) => {
            console.log(er);
            res.status(200).json({ ack: false });
          });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      console.log(er);
    });
});

module.exports = router;
