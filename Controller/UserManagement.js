const mongodb = require("mongodb");
const db = require("../db");
<<<<<<< HEAD
const nodemailer=require('nodemailer');

let newIDNo;
let newID;


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


function sendEmail(email,pwd){
  const h1="<h2>Login Details for LMS</h2><hr>"
  const h2=h1+"<h3>UserName: " + email + "<br>Password: "+pwd +"</h3>"

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'project2020sliit@gmail.com',
      pass: 'sliit2020'
    }
  });
  
  var mailOptions = {
    from: 'project2020sliit@gmail.com',
    to: email,
    subject: 'Login Details',
    html: h2
    
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      // return false
    } else {
      console.log('Email sent: ' + info.response);
      // return true
    }
  });

}



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
  const emailIDtoSend= req.body.email;
  let password;
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .findOne({ email: req.body.email })
    .then((resp) => {
      if (!resp) {
        password = generatePassword();

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
            if (resp.insertedId) {
              res.status(200).json({ notAdded: false });
              sendEmail(emailIDtoSend,password)

              
            }
            else{
              res.status(200).json({ error: true });
            }
            
          })
          .catch((er) => {
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

exports.EditUser = (req, res, next) => {
=======
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
    .findOne({ email: req.query.email })
    .then((resp) => {
      const userID = resp._id;
      if (resp) {
        const OTP = Math.floor(Math.random() * 89999) + 10000;
        db.getDb()
          .db()
          .collection("OTP")
          .insertOne({ userID, email: req.query.email, OTP: OTP })
          .then((resp) => {
            res.status(200).json({ available: true, userID });
          });
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch((er) => {
      console.log(er);
    });
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
>>>>>>> 0fb22ce847a91ba46bc5461b9bee832b135e5f70
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
<<<<<<< HEAD
  if (req.query.id.length !== 24) {
=======
  if (req.query.ID.length !== 24) {
>>>>>>> 0fb22ce847a91ba46bc5461b9bee832b135e5f70
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
<<<<<<< HEAD
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

exports.UpdateUser = (req, res, next) => {
=======
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
>>>>>>> 0fb22ce847a91ba46bc5461b9bee832b135e5f70
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
<<<<<<< HEAD
    res.status(200).json({ fetch: false });
    return;
  }
=======
    res.status(200).json({ ack: false });
    return;
  }

>>>>>>> 0fb22ce847a91ba46bc5461b9bee832b135e5f70
  db.getDb()
    .db()
    .collection("User")
    .updateOne(
<<<<<<< HEAD
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
=======
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
>>>>>>> 0fb22ce847a91ba46bc5461b9bee832b135e5f70
        },
      }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
<<<<<<< HEAD
        res.status(200).json({ updated: true });
      } else {
        res.status(200).json({ updated: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ updated: false });
    });
};

exports.DeleteUser = (req, res, next) => {
=======
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
>>>>>>> 0fb22ce847a91ba46bc5461b9bee832b135e5f70
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
<<<<<<< HEAD
    res.status(200).json({ fetch: false });
=======
    res.status(200).json({ ack: false });
    return;
  }

  let poster = req.files.dp;
  const fileName = req.body._id + poster.name;

  if (
    !poster.mimetype.includes("image/jpeg") ||
    !(poster.size / (1024 * 1024) < 5)
  ) {
    res.status(200).json({ file: false });
    return;
  }

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
>>>>>>> 0fb22ce847a91ba46bc5461b9bee832b135e5f70
    return;
  }
  db.getDb()
    .db()
    .collection("User")
<<<<<<< HEAD
    .deleteOne({ _id: new mongodb.ObjectId(req.body._id) })
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
=======
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
  db.getDb()
    .db()
    .collection("Enroll")
    .updateOne(
      {
        _id: new mongodb.ObjectId(req.body.ID),
      },
      { $pull: { students: req.body.student },}
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

exports.ResetPass = (req, res, next) => {
  if (req.body._id.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .updateOne(
      {
        _id: new mongodb.ObjectId(req.body._id),
      },
      { $set: { password: req.body.password } }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
        db.getDb()
          .db()
          .collection("OTP")
          .deleteOne({ userID: new mongodb.ObjectId(req.body._id) })
          .then((resp) => {
            res.status(200).json({ ack: true });
          })
          .catch();
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false });
    });
};

exports.CheckValidity = (req, res, next) => {
  if (req.query.userID.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }
  db.getDb()
    .db()
    .collection("OTP")
    .findOne({
      userID: new mongodb.ObjectId(req.query.userID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false });
    });
};



>>>>>>> 0fb22ce847a91ba46bc5461b9bee832b135e5f70
