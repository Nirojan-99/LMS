const mongodb = require("mongodb");
const db = require("../db");

//pdf
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


exports.GetEvent = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Event")
    .find({ $or: [{ creator: req.query.userID }, { type: "admin" }] })
    .sort({ date: 1 })
    .toArray()
    .then((resp) => {
      if (resp) {

        // const insightName = "insight" + req.query.userID + ".pdf";
        // const insightPath = path.join("Reports", "Events", insightName);
        // const PDFKit = new PDFDocument();
        // PDFKit.pipe(fs.createWriteStream(insightPath));

        // PDFKit.fillColor("red")
        //   .fontSize(25)
        //   .text("EVENTS SUMMARY ");
        // PDFKit.text("\n");
        // PDFKit.fillColor("black").fontSize(12).text("EVENT NAME ---- EVENT DATE ---- CREATED DATE");
        // PDFKit.text("\n");
        // resp.map((row) => {
        //   PDFKit.fillColor("black")
        //     .fontSize(12)
        //     .text(
        //       row.title + " ----- " + row.date + " ----- " + row.date_time
        //     );
        //   PDFKit.text("\n");
        // });
        // PDFKit.end();

        res.status(200).json(resp);

        //

       
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ available: false, msg: er });
    });
};

exports.AddEvent = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Event")
    .insertOne(req.body)
    .then((resp) => {
      if (resp.insertedId) {
        res.status(200).json({ inserted: true });
      } else {
        res.status(200).json({ inserted: false });
      }
    })
    .catch(() => {
      res.status(200).json({ inserted: false });
    });
};

exports.DeleteEvent = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query._id.length !== 24) {
    res.status(200).json({ deleted: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Event")
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
