const Router = require("express").Router;
const router = Router();
const Enroll = require("../Controller/Enroll");

router.post("/get_enrollcount", Enroll.EnrollCount);

module.exports = router;