const Router = require("express").Router;
const router = Router();
const Event = require("../Controller/Event");

router.get("/get_events", Event.GetEvent);

router.post("/add_event", Event.AddEvent);

router.delete("/delete_event", Event.DeleteEvent);

module.exports = router;
