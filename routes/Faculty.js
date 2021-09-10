const Router = require("express").Router;
const mongodb = require("mongodb");

const db = require("../db");
const router = Router();

router.post("/addFaculty", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Faculty")
    .insertOne(req.body)
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

router.get("/get_faculties", (req, res, next) => {
  
  db.getDb()
    .db()
    .collection("Faculty")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: "no faculty at the moment" });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "can not get faculty from database" });
    });
});


router.post("/delete_faculty", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Faculty")
    .deleteOne({ _id: new mongodb.ObjectId(req.body._id) })
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
});

router.post("/get_courses", (req, res, next) => {
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
        console.log(resp);
        // console.log("called");
        res.status(200).json(resp);
      })
      .catch((er) => {
        console.log(er);
      });
  } else {
    res.status(200).json({ msg: "no Courses" });
  }
});

router.post("/getfaculty", (req, res, next) => {

  db.getDb()
    .db()
    .collection("Faculty")
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

router.post("/UpdateFaculty", (req, res, next) => {
  console.log(req.body)
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
      res.status(200).json(resp);
      console.log(resp);
  
      
    })
    .catch(() => {
      console.log("error");
    });
});


module.exports = router;
