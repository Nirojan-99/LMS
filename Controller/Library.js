const db = require("../db");
const mongodb = require("mongodb");
const fileUpload = require("express-fileupload");

exports.Addbook = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  if (req.files) {
    console.log(req.files);
    let poster = req.files.bookPoster;
    let books = req.files.books;
    const fileName = req.body.author + poster.name;
    const bookName = req.body.author + books.name;

    books.mv("Books/" + bookName, (error) => {
      if (error) {
        res.status(200).json({ uploaded: false });
      } else {
        const Booklink = "http://localhost:5000/books/" + bookName;
        poster.mv("Books/" + fileName, (error) => {
          if (error) {
            console.log(error);
          } else {
            const link = "http://localhost:5000/books/" + fileName;
            if (req.body.edit === "true") {
              db.getDb()
                .db()
                .collection("Library")
                .updateOne(
                  { _id: new mongodb.ObjectId(req.body._id) },
                  {
                    $set: {
                      name: req.body.name,
                      author: req.body.author,
                      bookDetails: req.body.bookDetails,
                      date_time: req.body.date_time,
                      bookPoster: link,
                      book: Booklink,
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
            } else {
              db.getDb()
                .db()
                .collection("Library")
                .insertOne({
                  name: req.body.name,
                  author: req.body.author,
                  bookDetails: req.body.bookDetails,
                  date_time: req.body.date_time,
                  bookPoster: link,
                  book: Booklink,
                })
                .then((resp) => {
                  console.log(resp);
                  if (resp.insertedId) {
                    res.status(200).json({ ack: true });
                  } else {
                    res.status(200).json({ ack: false });
                  }
                })
                .catch((er) => {
                  res.status(200).json({ ack: false });
                });
            }
          }
        });
      }
    });
  } else {
    console.log("cl");
    db.getDb()
      .db()
      .collection("Library")
      .updateOne(
        { _id: new mongodb.ObjectId(req.body._id) },
        {
          $set: {
            name: req.body.name,
            author: req.body.author,
            bookDetails: req.body.bookDetails,
            date_time: req.body.date_time,
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
};

exports.GetBook = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Library")
    .findOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ ack: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};

exports.GetBooks = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Library")
    .find({ type: "book" })
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ ack: false });
      } else {
        res.status(200).json({books:resp});
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};
