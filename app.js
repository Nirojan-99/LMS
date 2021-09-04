const express = require("express");
const cors = require('cors')
const app = express();
const BodyParser = require("body-parser");

const moduleRoutes = require('./routes/modulePage');
const AdminRoutes = require('./routes/Admin');
const JobRoutes = require('./routes/Jobportal');
const db = require('./db');

app.use(BodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(BodyParser.json());

app.use(cors())

app.use("/uploads" ,express.static("uploads"))
app.use("/files" ,express.static("files"))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});



app.use('/admin', AdminRoutes);
app.use('/', JobRoutes);
// app.use('/', moduleRoutes);


db.initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(5000);
  }
});
