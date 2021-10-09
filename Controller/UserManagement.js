const mongodb = require("mongodb");
const db = require("../db");
const nodemailer = require("nodemailer");

//function for generate password for user Registeration
function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

//function for sendEmail to the User
function sendEmail(email, pwd) {
  const h1 = "<h2>Login Details for LMS</h2><hr>";
  const h2 = h1 + "<h3>UserName: " + email + "<br>Password: " + pwd + "</h3>";

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "project2020sliit@gmail.com",
      pass: "sliit2020",
    },
  });

  var mailOptions = {
    from: "project2020sliit@gmail.com",
    to: email,
    subject: "Login Details",
    html: h2,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      // return false
    } else {
      console.log("Email sent: " + info.response);
      // return true
    }
  });
}

//get the LMS last ID
exports.GetUserID = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ noData: true });
      } else {
        const last = resp[resp.length - 1];
        const newIDNo = last.IDNo + 5;
        res.status(200).json(newIDNo);
      }
    })
    .catch(() => {
      res.status(200).json({ error: true });
    });
};

//Add the User
exports.AddUser = (req, res, next) => {
  const emailIDtoSend = req.body.email;
  let password;
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (
    req.body === null ||
    req.body.email === null ||
    req.body.contact === null ||
    req.body.userIdNo === null
  ) {
    res.status(200).json({ inValidReq: true });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .findOne({ email: req.body.email })
    .then((resp) => {
      if (!resp) {
        db.getDb()
          .db()
          .collection("User")
          .findOne({ contact: req.body.contact })
          .then((resp) => {
            if (resp) {
              res.status(200).json({ contactExist: true });
            } else {
              password = generatePassword();

              db.getDb()
                .db()
                .collection("User")
                .insertOne({
                  name: req.body.name,
                  email: req.body.email,
                  password: password,
                  type: req.body.role,
                  ID: "LMS" + req.body.userIdNo,
                  IDNo: req.body.userIdNo,
                  date: req.body.date,
                  contact: req.body.contact,
                  address: req.body.address,
                  faculty: req.body.faculty,
                })
                .then((resp) => {
                  if (resp.insertedId) {
                    res.status(200).json({ notAdded: false });
                    sendEmail(emailIDtoSend, password);
                  } else {
                    res.status(200).json({ error: true });
                  }
                })
                .catch((er) => {
                  res.status(200).json({ error: true });
                });
            }
          })
          .catch(() => {
            res.status(200).json({ error: true });
          });
      } else {
        res.status(200).json({ notAdded: true });
      }
    })
    .catch((er) => {
      res.status(200).json({ error: true });
    });
};

//Get all the Users From System
exports.GetUsers = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("User")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ noData: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      res.status(200).json({ dbError: true });
    });
};

//Get the all details of a User to edit
exports.EditUser = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.id.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .findOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ noData: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      res.status(200).json({ dbError: true });
    });
};

//Update the User Details
exports.UpdateUser = (req, res, next) => {
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

//Delete the User
exports.DeleteUser = (req, res, next) => {
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
    .collection("User")
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
