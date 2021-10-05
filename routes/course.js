const Router = require("express").Router;
const router = Router();
const Course = require("../Controller/course");

router.get("/getcourse/", Course.GetCourse);

router.post("/addcourse", Course.AddCourse);

router.put("/Updatecourse", Course.UpdateCourse);

router.delete("/delete_course/", Course.DeleteCourse);

router.get("/getyear/", Course.GetYear);

router.post("/get_Module", Course.GetModule);


module.exports = router;
