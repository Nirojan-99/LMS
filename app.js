const express = require("express");
const cors = require('cors')
const app = express();
const BodyParser = require("body-parser");

const AdminRoutes = require('./routes/Admin');
const JobRoutes = require('./routes/Jobportal');
const Insights = require('./routes/insights');
const User = require('./routes/User');
const Attandance = require('./routes/Attandance');
const Event = require('./routes/Event');
const HelpDesk = require('./routes/HelpDesk');
const Announcement = require('./routes/Announcement');
const UserManagement=require('./routes/UserManagement');


const db = require('./db');

app.use(BodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(BodyParser.json());

app.use(cors())

app.use("/uploads" ,express.static("uploads"))
app.use("/Dp" ,express.static("Dp"))
app.use("/files" ,express.static("files"))
app.use("/announcement" ,express.static("announcement"))

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
app.use('/insight', Insights);
app.use('/user', User);
app.use('/attandance', Attandance);
app.use('/event', Event);
app.use('/helpDesk', HelpDesk);
app.use('/announcement', Announcement);
app.use('/', JobRoutes);
app.use('/userManagement',UserManagement);



db.initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(5000);
  }
});
