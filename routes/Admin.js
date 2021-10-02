const Router = require("express").Router;
const router = Router();
const fileUpload = require("express-fileupload");

const Material = require("../Controller/Admin");
const Student = require("../Controller/Students");

router.use(fileUpload());

router.get("/get_week/", Student.GetWeek);

router.post("/add_week",Material.AddWeek );

router.post("/add_material/", Material.AddMaterial);

router.get("/get_materials/", Student.GetMaterials);

router.get("/get_module/", Student.GetModule);

router.get("/get_material/", Student.GetMaterial);

router.post("/update_attandance", Material.UpdateAttandance);

router.delete("/delete_material/", Material.DeleteMaterial);

router.post("/add_submission/", Material.AddSubmission);

router.post("/edit_submission/", Material.EditSubmission);

router.post("/edit_link/", Material.EditLink);

router.post("/add_file/", Material.AddFiles);

router.post("/edit_notes/", Material.EditNotes);

router.get("/get_material/date/", Material.GetMDate);

router.get("/check_enrollment/", Material.CheckEnrollment);

module.exports = router;
