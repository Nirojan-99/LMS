const mongodb = require("mongodb");

const db = require("../db");

// get request
exports.GetCourse = (req, res, next) => {
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
    .collection("course")
    .findOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ fetch: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
};

// post request
//add course
exports.AddCourse = (req, res, next) => {
  db.getDb()
    .db()
    .collection("course")
    .insertOne(req.body.data)
    .then((resp) => {
      const facultyID = resp.insertedId;
      db.getDb()
        .db()
        .collection("Faculty")
        .updateOne(
          {
            _id: mongodb.ObjectId(req.body.facultyID),
          },
          { $push: { courses: facultyID } }
        )
        .then((resp) => {
          res.status(200).json(resp);
        })
        .catch(() => {});
    })
    .catch((er) => {
      console.log(er);
    });
};

// post request
// update course
exports.UpdateCourse = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("course")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          courseID: req.body.courseID,
          coursename: req.body.coursename,
          courseIncharge: req.body.courseIncharge,
          courseDuration: req.body.courseDuration,
          courseYear: req.body.courseYear,
          semester: req.body.semester,
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
      console.log("error");
    });
};

// delete request
// course  delete
exports.DeleteCourse = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.id.length !== 24) {
    res.status(200).json({ deleted: false });
    return;
  }
  db.getDb()
    .db()
    .collection("course")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ deleted: true });
      } else {
        res.status(200).json({ deleted: false });
      }
    })
    .catch((er) => {
      console.log(er);
    });
};

// get request
// get year
exports.GetYear = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("course")
    .findOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ fetchYear: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
//

// post request
// get Module
exports.GetModule = (req, res, next) => {
  if (req.body.Modules) {
    const contentID = req.body.Modules.map((row) => {
      return mongodb.ObjectId(row);
    });

    db.getDb()
      .db()
      .collection("Module")
      .find({ _id: { $in: contentID } })
      .toArray()
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((er) => {
        console.log(er);
      });
  } else {
    res.status(200).json({ msg: "no Module" });
  }
};
