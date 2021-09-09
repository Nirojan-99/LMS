const mongodb = require("mongodb");
const db = require("../db");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const e = require("express");

exports.Login = (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      email: req.body.email,
      password: req.body.password,
    })
    .then((resp) => {
      if (resp) {
        const token = jwt.sign(
          { userID: resp._id, email: resp.email },
          "lmsuservalidation",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          auth: true,
          details: resp,
          token: token,
          tokenExpiration: 1,
        });
      } else {
        res.status(200).json({ auth: false });
      }
    })
    .catch(() => {
      res.status(200).json({ auth: false });
    });
};

exports.CheckMail = (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({ email: req.body.email })
    .then((resp) => {
      if (resp) {
        const OTP = Math.floor(Math.random() * 89999) + 10000;
        db.getDb()
          .db()
          .collection("OTP")
          .insertOne({ email: req.body.email, OTP: OTP })
          .then((resp) => {
            res.status(200).json({ available: true });
          });
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch(() => {});
};

exports.CheckOTP = (req, res, next) => {
  db.getDb()
    .db()
    .collection("OTP")
    .findOne({ email: req.body.email, OTP: parseInt(req.body.otp) })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ valid: true, email: req.body.email });
      } else {
        res.status(200).json({ valid: false });
      }
    })
    .catch(() => {});
};

exports.FindUser = (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      _id: new mongodb.ObjectId(req.body._id),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(200).json({ auth: false });
      }
    })
    .catch(() => {});
};

exports.GetUser = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.ID.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      _id: new mongodb.ObjectId(req.query.ID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(200).json({ fetch: false });
      }
    })
    .catch(() => {
      res.status(200).json({ fetch: false });
    });
};

exports.EditUser = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }
  console.log("called");
  db.getDb()
    .db()
    .collection("User")
    .updateOne(
      {
        _id: new mongodb.ObjectId(req.body._id),
      },
      {
        $set: {
          name: req.body.name,
          address: req.body.address,
          contact: req.body.contact,
          password: req.body.password,
          bio: req.body.bio,
        },
      }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false, msg: er });
    });
};

exports.AddDP = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }

  let poster = req.files.dp;
  const fileName = req.body._id + poster.name;

  poster.mv("Dp/" + fileName, (error) => {
    if (error) {
      res.status(200).json({ ack: false });
    } else {
      const dp = "http://localhost:5000/Dp/" + fileName;

      db.getDb()
        .db()
        .collection("User")
        .updateOne(
          { _id: new mongodb.ObjectId(req.body._id) },
          {
            $set: {
              dp: dp,
            },
          }
        )
        .then((resp) => {
          if (resp.modifiedCount === 1) {
            res.status(200).json({ ack: true });
          } else {
            res.status(200).json({ ack: false });
          }
        })
        .catch(() => {
          res.status(200).json({ ack: false });
        });
    }
  });
};

exports.GetDP = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.ID.length !== 24) {
    res.status(200).json({ available: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      _id: new mongodb.ObjectId(req.query.ID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ dp: resp.dp, name: resp.name });
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ available: false, msg: er });
    });
};

exports.DeleteUser = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.ID.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .deleteOne({
      _id: new mongodb.ObjectId(req.query.ID),
    })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false, msg: er });
    });
};

exports.GetModules = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Enroll")
    .find(
      {
        students: req.query.ID,
      },
      { students: -1 }
    )
    .toArray()
    .then((resp) => {
      if (resp) {
        res.status(200).json({ courses: resp });
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ msg: er });
    });
};

exports.Unenroll = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body.ID.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }
  console.log("called");
  db.getDb()
    .db()
    .collection("Enroll")
    .updateOne(
      {
        _id: new mongodb.ObjectId(req.body.ID),
      },
      { $pull: { students: req.body.student } }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};
