const Router = require("express").Router;
const fileUpload = require("express-fileupload");
const router = Router();
const Ann = require("../Controller/Announcement");

router.use(fileUpload());

router.post("/add_announcement", Ann.AddAnnouncement);

router.get("/get_announcements", Ann.GetAnnouncements);

router.get("/get_announcement/", Ann.GetAnnouncement);

router.delete("/delete_announcement/", Ann.DeleteAnnouncement);

module.exports = router;
