const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();

router.post("/login", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      email: req.body.email,
      passward: req.body.password,
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ auth: true, details: resp });
      } else {
        res.status(200).json({ auth: false });
      }
    })
    .catch(() => {});
});

router.post("/check_mail", (req, res, next) => {
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
});

router.post("/check_otp", (req, res, next) => {
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
});

router.post("/add_user", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .insertOne(req.body)
    .then((resp) => {
      if (resp) {
        res.status(200).json({ valid: true, email: req.body.email });
      } else {
        res.status(200).json({ valid: false });
      }
    })
    .catch(() => {});
});

module.exports = router;
