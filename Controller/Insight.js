const mongodb = require("mongodb");
const db = require("../db");

//pdf
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.getInsight = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Material_Insight")
    .findOne({ material_id: new mongodb.ObjectId(req.query.materialID) })
    .then((resp) => {
      if (resp) {
        // const insightName = "insight" + req.query.materialID + ".pdf";
        // const insightPath = path.join("Reports", "ModuleMaterial", insightName);
        // const PDFKit = new PDFDocument();
        // PDFKit.pipe(fs.createWriteStream(insightPath));

        // PDFKit.fillColor("red").fontSize(25).text("INSIGHTS");
        // PDFKit.text("\n");
        // resp.students.map((row) => {
        //   const date = row.date_time.split("@");
        //   PDFKit.fillColor("black")
        //     .fontSize(12)
        //     .text(row.student + " ----- " + date[0] + " ---- " + date[1]);
        //   PDFKit.text("\n");
        // });
        // PDFKit.end();
      }
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.AddInsight = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Material_Insight")
    .findOne({
      material_id: new mongodb.ObjectId(req.body.material_id),
      "students.student": req.body.student,
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        db.getDb()
          .db()
          .collection("Material_Insight")
          .updateOne(
            { material_id: new mongodb.ObjectId(req.body.material_id) },
            {
              $addToSet: {
                students: {
                  student: req.body.student,
                  date_time: req.body.date_time,
                },
              },
            },
            { upsert: true }
          )
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((er) => {
            console.log(er);
          });
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
