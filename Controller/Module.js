
const mongodb = require("mongodb");

const db = require("../db");




// get request
// get Module
exports.GetModule = (req, res, next) => {
    if (req.auth === false) {
      res.status(200).json({ auth: false });
      return;
    }
    db.getDb()
      .db()
      .collection("Module")
      .findOne({
        _id: new mongodb.ObjectId(req.query.moduleID),
      })
      .then((resp) => {
        if (!resp) {
          res.status(200).json({ moduledata:false });
        } else {
          res.status(200).json(resp);
        }
      })
      .catch(() => {
        console.log("err");
        res.status(200).json({ error: "can not get Module from database" });
      });
  };


  //get request 
//get modules  
exports.GetModules =  (req, res, next) => {
    if (req.auth === false) {
      res.status(200).json({ auth: false });
      return;
    }
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
          res.status(200).json({ modules: false });
        } else {
          res.status(200).json(resp);
        }
      })
      .catch(() => {
        console.log("err");
        res.status(200).json({ error: "can not get Module from database" });
      });
  };
// post request 
// Add Module
exports.AddModule =  (req, res, next) => {

  db.getDb()
    .db()
    .collection("Module")
    .insertOne(req.body.data)
    .then((resp) => {
      const courseID = resp.insertedId;
    
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
     
          res.status(200).json(resp);
        })
        .catch(() => {});
    })
    .catch((er) => {
      console.log(er);
    });
};


// post request 
// Update Module
exports.UpdateModule = (req, res, next) => {
    if (req.auth === false) {
      res.status(200).json({ auth: false });
      return;
    }
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
        // res.status(200).json(resp);
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
// delete Module
exports.DeleteModule =  (req, res, next) => {
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
    .collection("Module")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {

      // res.status(200).json(resp);
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
//get module details
 
exports.GetModuleDetails =  (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Module")
    .find({
      _id: new mongodb.ObjectId(req.query.moduleId),
    })
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ fetch: false });
      } else {
        res.status(200).json(resp);
   
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ name: false });
     // res.status(200).json({ error: "can not get Module from database" });
        });
};
//get request  
// get ModuleLectureIncharge and Modulename

exports.GetLIC  = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
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
};


// post request
// enroll the course
exports.Enroll =  (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Module")
    .findOne({
      _id: new mongodb.ObjectId(req.body.moduleID),
      ModuleEnrollmentkey: req.body.key,
    })
    .then((resp) => {
     
      if (resp) {
        db.getDb()
          .db()
          .collection("Enroll")
          .updateOne(
            { id: req.body.moduleID, name: req.body.name},
            { $addToSet: { students: req.body.studentID, }},
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
};


