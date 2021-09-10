const Router = require("express").Router;
const router = Router();

const Report = require("../Controller/Insight");

router.get("/material/", Report.getInsight);

router.post("/add_insight", Report.AddInsight);

module.exports = router;
