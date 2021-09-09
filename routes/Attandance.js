const Router = require("express").Router;
const router = Router();
const Att = require("../Controller/Attandance");

router.post("/mark_attandance",Att.MarkAttandance);

router.get("/check_attandance", Att.CheckAttandance);

router.get("/get_attandances", Att.GetAttandees);

router.post("/get_students", Att.getStudents);

module.exports = router;
