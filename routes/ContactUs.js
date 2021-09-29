const Router = require("express").Router;
const router = Router();

const controller = require("../Controller/ContactUs");

router.post("/query", controller.postQuery);

module.exports = router;