const db = require("../db");
const mongodb = require("mongodb");

exports.AddExamMark = (req, res) => {
    db.getDb()
        .db()
        .collection("ExamMarks")
        .insertOne(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((er) => {
            res.status(400).json({ error: true });
            console.log(er);
        });
};

exports.getAllExamMarks = (req, res, next) => {
    db.getDb()
        .db()
        .collection("ExamMarks")
        .find()
        .toArray()
        .then((response) => {
            if (!response) {
                res.status(200).json({ error: true });
            } else {
                res.status(200).json(response);
            }
        })
        .catch((er) => {
            console.log(er);
        });
};

exports.getExamMark = (req, res, next) => {
    db.getDb()
        .db()
        .collection("ExamMarks")
        .findOne({ _id: new mongodb.ObjectId(req.query.ID) })
        .then((response) => {
            if (!response) {
                res.status(400).json({ error: true });
            } else {
                res.status(200).json(response);
            }
        })
        .catch((er) => {
            res.status(400).json({ error: true });
            console.log(er);
        });
};

exports.deleteExamMark = (req, res, next) => {
    db.getDb()
        .db()
        .collection("ExamMarks")
        .deleteOne({ _id: new mongodb.ObjectId(req.query.ID) })
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((er) => {
            console.log(er);
        });
};

exports.updateExamMark = (req, res, next) => {
    db.getDb()
        .db()
        .collection("ExamMarks")
        .updateOne(
            { _id: mongodb.ObjectId(req.query.ID) },
            {
                $set: req.body,
            }
        )
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((er) => {
            console.log(er);
        });
};
