const Router = require("express").Router;
const router = Router();

const controller = require("../Controller/Studentportal");

router.get("/get_GPA/", controller.getGPA);

router.post("/GPA/", controller.AddNewSemester);

router.post("/update_GPA/", controller.UpdateGPA);

module.exports = router;
