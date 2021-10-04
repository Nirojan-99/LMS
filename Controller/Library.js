const db = require("../db");
const mongodb = require("mongodb");
const fileUpload = require("express-fileupload");

exports.Addbook = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  if (req.files) {
    let poster = req.files.bookPoster;
    let books = req.files.books;
    const fileName = req.body.author + poster.name;
    const bookName = req.body.author + books.name;

    if (
      !poster.mimetype.includes("image/jpeg") ||
      !(poster.size / (1024 * 1024) < 5)
    ) {
      res.status(200).json({ fileError: true });
      return;
    } else if (
      !books.mimetype.includes("pdf") ||
      !(books.size / (1024 * 1024) < 15)
    ) {
      res.status(200).json({ fileError: true });
      return;
    }

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
                      type: req.body.type,
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
                  type: req.body.type,
                })
                .then((resp) => {
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
            type: req.body.type,
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

exports.GetPaper = (req, res, next) => {
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

exports.GetPapers = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Library")
    .find({ type: "paper" })
    .toArray()
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
        res.status(200).json({ books: resp });
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};

exports.DeleteBook = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Library")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};

exports.DeletePaper = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Library")
    .deleteOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};

exports.AddInsight = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Library_Insight")
    .findOne({
      _id: new mongodb.ObjectId(req.body.bookID),
      "students.id": req.body.ID,
    })
    .then((resp) => {
      if (!resp) {
        db.getDb()
          .db()
          .collection("Library_Insight")
          .updateOne(
            { _id: new mongodb.ObjectId(req.body.bookID) },
            {
              $addToSet: {
                students: { id: req.body.ID, date_time: req.body.date_time },
              },
            },
            { upsert: true }
          )
          .then((res1) => {});
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};

exports.GetInsight = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  db.getDb()
    .db()
    .collection("Library_Insight")
    .findOne({
      _id: new mongodb.ObjectId(req.query.bookID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};

exports.Addpaper = (req, res, next) => {
  // if (req.auth === false) {
  //   res.status(200).json({ auth: false });
  //   return;
  // }
  if (req.files) {
    let poster = req.files.paperfile;
    const fileName = req.body.name + poster.name;

    if (
      !poster.mimetype.includes("application") ||
      !(poster.size / (1024 * 1024) < 10)
    ) {
      res.status(200).json({ fileError: true });
      return;
    }

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
                  date_time: req.body.date_time,
                  paperLink: link,
                  type: req.body.type,
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
              date_time: req.body.date_time,
              paperLink: link,
              type: req.body.type,
            })
            .then((resp) => {
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
  } else {
    db.getDb()
      .db()
      .collection("Library")
      .updateOne(
        { _id: new mongodb.ObjectId(req.body._id) },
        {
          $set: {
            name: req.body.name,
            date_time: req.body.date_time,
            type: req.body.type,
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
