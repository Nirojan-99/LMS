const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
const db = require("../db");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.auth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    req.auth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "lmsuservalidation");
  } catch (err) {
    req.auth = false;
    return next();
  }
  if (!decodedToken) {
    req.auth = false;
    return next();
  }
  req.userID = decodedToken.userID;
  userID = decodedToken.userID;

  db.getDb()
    .db()
    .collection("User")
    .findOne({ _id: new mongodb.ObjectId(userID) })
    .then((resp) => {
      if (resp) {
        const type = resp.type;
        req.type = type === "admin" || type === "lecturer";
      } else {
        req.type = false;
      }
    })
    .catch((er) => {
      console.log(er);
    });

  req.auth = true;
  next();
};
