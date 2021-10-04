const Router = require("express").Router;
const router = Router();
const Enroll = require("../Controller/Enroll");

router.post("/get_enrollcount", Enroll.EnrollCount);
router.get("/enrollstatus/", Enroll.EnrollStatus);
router.get("/get_enroll/", Enroll.GetEnroll);

module.exports = router;