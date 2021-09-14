const mongodb = require("mongodb");
const db = require("../db");
let newIDNo;
let newID;

exports.GetUserID = (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .find()
    .toArray()
    .then((resp) => {
      const last = resp[resp.length - 1];
      newIDNo = last.IDNo + 5;
      newID = "LMS" + newIDNo;
      res.status(200).json(newID);
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "Can not get user data from database" });
    });
};

exports.AddUser = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
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
            IDNo: newIDNo,
            date: req.body.date,
            contact: req.body.contact,
            address: req.body.address,
            faculty: req.body.faculty,
          })
          .then((resp) => {
            res.status(200).json({ notAdded: false });
          })
          .catch((er) => {
            console.log(er);
          });
      } else {
        res.status(200).json({ notAdded: true });
      }
    })
    .catch(() => {
      console.log("error");
    });
};

exports.GetUsers = (req, res, next) => {
  
  // if (req.auth === false) {
  //   console.log("-------------");
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  

  db.getDb()
    .db()
    .collection("User")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ noData: true});
      } else {
        // console.log(resp);
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      res.status(200).json({ dbError: true});
    });
};

exports.EditUser = (req, res, next) => {
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
};

exports.UpdateUser = (req, res, next) => {
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
};

exports.DeleteUser = (req, res, next) => {
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
};
