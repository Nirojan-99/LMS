const Router = require("express").Router;
const router = Router();
const Module = require("../Controller/Module");

router.get("/get_Module/", Module.GetModule);

router.get("/get_Modules/", Module.GetModules);

router.post("/addModule", Module.AddModule);

router.put("/UpdateModule", Module.UpdateModule);

router.delete("/delete_Module/", Module.DeleteModule);

// get Module details 
router.get("/get_Moduledetails/", Module.GetModuleDetails);

// get ModuleLectureIncharge and Modulename
router.get("/get_LIC/", Module.GetLIC);

//enroll the course
router.post("/enroll/", Module.Enroll);


module.exports = router;