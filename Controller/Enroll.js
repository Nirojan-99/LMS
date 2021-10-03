
const mongodb = require("mongodb");

const db = require("../db");

// post request 
// get enrollcount 
exports.EnrollCount =  (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Enroll")
    .findOne({ id: req.body.moduleId })
    .then((resp) => {
      // if (!resp) {
      //   res.status(200).json({ enrollcount: false });
      // } else {
        res.status(200).json(resp);
   
      
      // res.status(200).json(resp);

      // console.log(resp);

      // res.status(200);
    })
    .catch((er) => {
      console.log(er);
    });
};


