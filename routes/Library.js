const Router = require("express").Router;
const fileUpload = require("express-fileupload");
const router = Router();
const Lib = require("../Controller/Library");

router.use(fileUpload());

router.post("/add_book", Lib.Addbook);

router.get("/get_book", Lib.GetBook);

router.get("/get_books", Lib.GetBooks);

module.exports = router;
