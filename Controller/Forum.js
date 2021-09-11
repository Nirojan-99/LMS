const mongodb = require("mongodb");
const db = require("../db");

const getTodayDate = () => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  return today;
};

exports.GetModuleID = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Week")
    .findOne({ _id: new mongodb.ObjectId(req.query.weekID) })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

exports.AddForum = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .insertOne({
      title: "TopForum",
      topic: req.body.topic,
      weekID: req.body.weekID,
      weekNo: req.body.weekNo,
      moduleID: req.body.moduleID,
      userID: req.body.userID,
      type: req.body.type,
      postedDate: getTodayDate(),
      visibility: req.body.visibility,
      msg: req.body.msg,
      replies: [],
    })
    .then((resp) => {
      res.status(200).json(resp);
      console.log("added");
    })
    .catch((er) => {
      console.log(er);
    });
};


exports.GetTopicForums = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Material")
    .find({ moduleID:req.query.moduleID, title:"TopForum"})
    .toArray()
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

exports.GetTopicForum = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  
  db.getDb()
    .db()
    .collection("Material")
    .findOne({ _id: new mongodb.ObjectId(req.query.forumID) })
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

exports.GetUserName = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  
  db.getDb()
    .db()
    .collection("User")
    .findOne({ _id: new mongodb.ObjectId(req.query.userID) })
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

exports.AddNormalForum = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Material")
    .insertOne({
      title: "NormalForum",
      weekID: req.body.weekID,
      moduleID: req.body.moduleID,
      userID: req.body.userID,
      type: req.body.type,
      postedDate: getTodayDate(),
      msg: req.body.msg,
      replies: [],
    })
    .then((resp) => {
      res.status(200).json(resp);
      console.log("added");
    })
    .catch((er) => {
      console.log(er);
    });
};


exports.GetNormalForums = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  console.log("ijifjisfjisjfijsoj");
  console.log(req.query);
  db.getDb()
    .db()
    .collection("Material")
    .find({ moduleID:req.query.moduleID, title:"NormalForum",weekID:req.query.weekID})
    .toArray()
    .then((resp) => {
      console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};