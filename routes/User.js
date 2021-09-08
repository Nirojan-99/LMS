const Router = require("express").Router;
const mongodb = require("mongodb");
const db = require("../db");
const router = Router();
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");

router.use(fileUpload());

router.post("/login", (req, res, next) => {
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
        res
          .status(200)
          .json({
            auth: true,
            details: resp,
            token: token,
            tokenExpiration: 1,
          });
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

router.post("/find_user", (req, res, next) => {
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
});

router.get("/get_user/", (req, res, next) => {
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
        res.status(200).json({ auth: false });
      }
    })
    .catch(() => {});
});

router.post("/edit_user", (req, res, next) => {
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
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch(() => {});
});

router.post("/add_dp", (req, res, next) => {
  console.log("call");
  let poster = req.files.dp;
  const fileName = req.body._id + poster.name;

  poster.mv("Dp/" + fileName, (error) => {
    if (error) {
      console.log(error);
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
          res.status(200).json(resp);
          console.log(res);
        })
        .catch(() => {
          console.log("error");
        });
    }
  });
});

router.get("/dp/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      _id: new mongodb.ObjectId(req.query.ID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ dp: resp.dp, name: resp.name });
      }
    })
    .catch(() => {});
});

router.delete("/delete_user/", (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .deleteOne({
      _id: new mongodb.ObjectId(req.query.ID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch(() => {});
});

router.get("/get_modules/", (req, res, next) => {
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
      }
    })
    .catch(() => {});
  // db.getDb()
  //   .db()
  //   .collection("Enroll")
  //   .updateOne(
  //     { id: "it2021" },
  //     {
  //       $addToSet: { students:req.query.ID,name:"ITP" },
  //     },
  //     { upsert:true }
  //   )

  //   .then((resp) => {
  //     if (resp) {
  //       res.status(200).json({ courses: { resp } });
  //     }
  //   })
  //   .catch(() => {});
});

router.post("/unenroll", (req, res, next) => {
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
      console.log(resp);
      if (resp) {
        res.status(200).json({});
      }
    })
    .catch(() => {});
});

module.exports = router;
