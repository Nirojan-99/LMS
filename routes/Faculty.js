const Router = require("express").Router;
const router = Router();
const Faculty = require("../Controller/Faculty");

router.get("/getfaculty/", Faculty.GetFaculty);

router.get("/get_faculties", Faculty.GetFaculties);

router.post("/addFaculty", Faculty.AddFaculty);

router.put("/UpdateFaculty", Faculty.UpdateFaculty);

router.delete("/delete_faculty/", Faculty.DeleteFaculty);

router.post("/get_courses", Faculty.GetCourse);

module.exports = router;
