const mongodb = require("mongodb");
const db = require("../db");

//function for get Today Date
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

//Get the moduleID of the week
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

//Add TopForum
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
    })
    .catch((er) => {
      console.log(er);
    });
};

//Get All Topics Forum
exports.GetTopicForums = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Material")
    .find({
      moduleID: req.query.moduleID,
      title: "TopForum",
      visibility: "visible",
    })
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

//Get specific Topic Forum
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
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

//Get the UserName who create Forum
exports.GetUserName = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.userID.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }

  db.getDb()
    .db()
    .collection("User")
    .findOne({ _id: new mongodb.ObjectId(req.query.userID) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ noData: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

//Add Normal Forum
exports.AddNormalForum = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body===null){
    res.status(200).json({ inValidReq: true });
    return;

  }
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
      if (resp.insertedId) {
      res.status(200).json({added:true});
      }
      else{
        res.status(200).json({ error: true });
      }
    })
    .catch((er) => {
      res.status(200).json({ error: true });
    });
};

//Get all NormalForums
exports.GetNormalForums = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }

  db.getDb()
    .db()
    .collection("Material")
    .find({
      moduleID: req.query.moduleID,
      title: "NormalForum",
      weekID: req.query.weekID,
    })
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ noData: true });
      } else {
      res.status(200).json(resp);
      }
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

//Add Reply Forum
exports.AddReplyForum = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body===null){
    res.status(200).json({ inValidReq: true });
    return;

  }
  db.getDb()
    .db()
    .collection("ReplyForums")
    .insertOne({
      title: "ReplyForum",
      parentNormalForumID: req.body.parentNormalForumID,
      userID: req.body.userID,
      type: req.body.type,
      postedDate: getTodayDate(),
      msg: req.body.msg,
    })
    .then((res1) => {
      if (res1.insertedId) {
        const replyForumID = res1.insertedId;
        db.getDb()
          .db()
          .collection("Material")
          .updateOne(
            { _id: mongodb.ObjectId(req.body.parentNormalForumID) },
            { $push: { replies: replyForumID } }
          )
          .then((resp) => {
            if (resp.modifiedCount === 1) {
              res.status(200).json({ inserted: true });
            } else {
              res.status(200).json({ inserted: false });
            }
          })
          .catch(() => {
            res.status(200).json({ inserted: false });
          });
      } else {
        res.status(200).json({ inserted: false });
      }
    })
    .catch(() => {
      res.status(200).json({ inserted: false });
    });
};

//Get Reply Forum
exports.GetReplyForum = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  //  console.log(req.query.replyForumID);
  db.getDb()
    .db()
    .collection("ReplyForums")
    .findOne({ _id: mongodb.ObjectId(req.query.replyForumID) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ noData: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

//Update Normal Forum
exports.UpdateNormalForum = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Material")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          msg: req.body.msg,
        },
      }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
        res.status(200).json({ updated: true });
      } else {
        res.status(200).json({ updated: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ updated: false });
    });
};

//Update Reply Forum
exports.UpdateReplyForum = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }

  db.getDb()
    .db()
    .collection("ReplyForums")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          msg: req.body.msg,
        },
      }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
        res.status(200).json({ updated: true });
      } else {
        res.status(200).json({ updated: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ updated: false });
    });
};

//Delete Reply Forum
exports.DeleteReplyForum = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("ReplyForums")
    .deleteOne({ _id: new mongodb.ObjectId(req.body._id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        db.getDb()
          .db()
          .collection("Material")
          .updateOne(
            { _id: new mongodb.ObjectId(req.body.parentNormalForumID) },
            { $pull: { replies: new mongodb.ObjectId(req.body._id) } }
          )
          .then((resp2) => {
            if (resp2.modifiedCount === 1) {
              res.status(200).json({ deleted: true });
            } else {
              res.status(200).json({ deleted: false });
            }
          })
          .catch(() => {
            res.status(200).json({ deleted: false });
          });

        // res.status(200).json({ deleted: true });
      } else {
        res.status(200).json({ deleted: false });
      }
    })
    .catch(() => {
      res.status(200).json({ deleted: false });
    });
};

//Delete Normal Forum
exports.DeleteNormalForum = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query._id.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Material")
    .deleteOne({ _id: new mongodb.ObjectId(req.query._id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ deleted: true });
      } else {
        res.status(200).json({ deleted: false });
      }
    })
    .catch(() => {
      res.status(200).json({ deleted: false });
    });
};
