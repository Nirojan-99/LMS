const Router = require("express").Router;
const router = Router();
const Forum=require("../Controller/Forum");

router.get("/get_moduleID/",Forum.GetModuleID);

router.post("/add_forum/",Forum.AddForum);

module.exports = router;
