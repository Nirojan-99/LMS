const Router = require("express").Router;
const router = Router();
const Forum=require("../Controller/Forum");

router.get("/get_moduleID/",Forum.GetModuleID);

router.post("/add_forum/",Forum.AddForum);

router.get("/get_topicForums/",Forum.GetTopicForums);

router.get("/get_topicForum/",Forum.GetTopicForum);

router.get("/get_userName/",Forum.GetUserName);

router.post("/add_normalForum/",Forum.AddNormalForum);

router.get("/get_normalForums/",Forum.GetNormalForums);

module.exports = router;
