const Router = require("express").Router;
const mongodb = require("mongodb");

const db = require("../db");
const router = Router();

router.post("/addcourse", (req, res, next) => {
  // console.log(req.body)
  db.getDb()
    .db()
    .collection("course")
    .insertOne(req.body.data)
    .then((resp) => {
      const facultyID = resp.insertedId;
      console.log(req.body.facultyID);
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
          console.log(resp);
          res.status(200).json(resp);
        })
        .catch(() => {});
    })
    .catch((er) => {
      console.log(er);
    });
});

// course  delete
router.post("/delete_course", (req, res, next) => {
  db.getDb()
    .db()
    .collection("course")
    .deleteOne({ _id: new mongodb.ObjectId(req.body._id) })
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

//try
router.post("/getyear", (req, res, next) => {
 
  db.getDb()
    .db()
    .collection("course")
    .findOne({ _id: new mongodb.ObjectId(req.body.id) })
    .then((resp) => {
    
      if (!resp) {
        res.status(200).json({ error: "no jobs at the moment" });
      } else {
        res.status(200).json(resp);
        console.log(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
});
//


router.post("/Updatecourse", (req, res, next) => {
  console.log(req.body)
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
          courseDuration:req.body.courseDuration,
          courseYear:req.body.courseYear,
          semester:req.body.semester,
        
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

router.post("/getcourse", (req, res, next) => {

  db.getDb()
    .db()
    .collection("course")
    .findOne({ _id: new mongodb.ObjectId(req.body.id) })
    .then((resp) => {
      // console.log(resp);
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



router.post("/get_Module", (req, res, next) => {
  if (req.body.Modules) {
    //   const arr = req.body.courses.split(",");
    const contentID = req.body.Modules.map((row) => {
      return mongodb.ObjectId(row);
    });

    db.getDb()
      .db()
      .collection("Module")
      .find({ _id: { $in: contentID } })
      .toArray()
      .then((resp) => {
        console.log(resp);
        // console.log("called");
        res.status(200).json(resp);
      })
      .catch((er) => {
        console.log(er);
      });
  } else {
    res.status(200).json({ msg: "no Module" });
  }
});




module.exports = router;
