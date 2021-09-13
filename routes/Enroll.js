const Router = require("express").Router;
const mongodb = require("mongodb");

const db = require("../db");
const router = Router();

router.post("/get_enrollcount", (req, res, next) => {
  db.getDb()
    .db()
    .collection("Enroll")
    .findOne({ id: req.body.moduleId })
    .then((resp) => {
      res.status(200).json(resp);

      console.log(resp);

      res.status(200);
    })
    .catch((er) => {
      console.log(er);
    });
});

module.exports = router;
