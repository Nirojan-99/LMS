const db = require("../db");
const mongodb = require("mongodb");

exports.AddExam = (req, res) => {
    db.getDb()
        .db()
        .collection("Exams")
        .insertOne(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((er) => {
            res.status(400).json({ error: true });
            console.log(er);
        });
};

exports.getAllExams = (req, res, next) => {
    db.getDb()
        .db()
        .collection("Exams")
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

exports.getExam = (req, res, next) => {
    db.getDb()
        .db()
        .collection("Exams")
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

exports.deleteExam = (req, res, next) => {
    db.getDb()
        .db()
        .collection("Exams")
        .deleteOne({ _id: new mongodb.ObjectId(req.query.ID) })
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((er) => {
            console.log(er);
        });
};

exports.updateExam = (req, res, next) => {
    db.getDb()
        .db()
        .collection("Exams")
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
