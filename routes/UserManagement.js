const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();
let newIDNo;
let newID;


router.post("/get_userID", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .find()
    .toArray()
    .then((resp) => {
     const last= resp[resp.length-1]
      newIDNo=last.IDNo +5;
      newID="LMS" + newIDNo;
      // console.log(newID);
      res.status(200).json(newID);
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "Can not get user data from database" });
    });
});



router.post("/add_user", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({ email: req.body.email })
    .then((resp) => {
      if (!resp) {
        function generatePassword() {
          var length = 8,
            charset =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
          for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
          }
          return retVal;
        }
        const password = generatePassword();
        
        db.getDb()
          .db()
          .collection("User")
          .insertOne({
            name: req.body.name,
            email: req.body.email,
            password: password,
            type: req.body.role,
            ID: newID,
            IDNo:newIDNo,
            date: req.body.date,
            contact: req.body.contact,
            address: req.body.address,
            faculty: req.body.faculty,
          })
          .then((resp) => {
            res.status(200).json(false);
            console.log("added");
          })
          .catch((er) => {
            console.log(er);
          });
      } else {
        console.log(resp);
        res.status(200).json(true);
      }
    })
    .catch(() => {
      console.log("error");
    });
});

router.post("/get_users", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: "No users at the moment" });
      } else {
        // console.log(resp);
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "Can not get user data from database" });
    });
});

router.post("/edit_user", (req, res, next) => {
  console.log(req.body);
  db.getDb()
    .db()
    .collection("User")
    // .findOne({ email: req.body.id })
    .findOne({ _id: new mongodb.ObjectId(req.body.id) })
    .then((resp) => {
      // console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });
});

router.post("/update_user", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          date: req.body.date,
          contact: req.body.contact,
          address: req.body.address,
          faculty: req.body.faculty,
          type: req.body.type,
          password: req.body.password,
        },
      }
    )
    .then((resp) => {
      res.status(200).json(resp);
      // console.log(res);
    })
    .catch(() => {
      console.log("error");
    });
});

router.post("/delete_user/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .deleteOne({ _id: new mongodb.ObjectId(req.body._id) })
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      console.log("err");
    });
});
module.exports = router;
