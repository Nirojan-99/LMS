const Router = require("express").Router;
const fileUpload = require("express-fileupload");
const router = Router();

const Job = require("../Controller/JobPortal");

router.use(fileUpload());

router.post("/add_job", Job.AddJob);

router.get("/get_job/", Job.GetJob);

router.get("/get_jobs", Job.GetJobs);

router.delete("/delete_job/", Job.DeleteJob);

module.exports = router;
