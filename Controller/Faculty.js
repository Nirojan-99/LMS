const mongodb = require("mongodb");

const db = require("../db");
// get request
exports.GetFaculty = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Faculty")
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
// get request
exports.GetFaculties = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Faculty")
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
      console.log("error");
      res.status(200).json({ error: "can not get faculty from database" });
    });
};
// add Faculty get request
exports.AddFaculty = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Faculty")
    .insertOne(req.body)
    .then((resp) => {
      if (resp.insertedId) {
        res.status(200).json({ insert: true });
      } else {
        res.status(200).json({ insert: false });
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
//
// post request
exports.UpdateFaculty = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Faculty")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          id: req.body.id,
          name: req.body.name,
          Incharge: req.body.Incharge,
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
//delete request
exports.DeleteFaculty = (req, res, next) => {
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
    .collection("Faculty")
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

//post request
exports.GetCourse = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body.courses) {
    //   const arr = req.body.courses.split(",");
    const contentID = req.body.courses.map((row) => {
      return mongodb.ObjectId(row);
    });

    db.getDb()
      .db()
      .collection("course")
      .find({ _id: { $in: contentID } })
      .toArray()
      .then((resp) => {
        if (!resp) {
          res.status(200).json({ error: "no course at the moment" });
        } else {
          res.status(200).json(resp);
        }
      })
      .catch((er) => {
        console.log(er);
      });
  } else {
    res.status(200).json({ msg: "no Courses" });
  }
};
