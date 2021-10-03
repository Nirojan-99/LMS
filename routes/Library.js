const Router = require("express").Router;
const fileUpload = require("express-fileupload");
const router = Router();
const Lib = require("../Controller/Library");

router.use(fileUpload());

router.post("/add_book", Lib.Addbook);

router.post("/add_paper", Lib.Addpaper);

router.post("/add_insight", Lib.AddInsight);

router.get("/get_insight", Lib.GetInsight);

router.get("/get_paper/", Lib.GetPaper);

router.get("/get_papers", Lib.GetPapers);

router.get("/get_book", Lib.GetBook);

router.get("/get_books", Lib.GetBooks);

router.delete("/delete_book/", Lib.DeleteBook);

router.delete("/delete_paper/", Lib.DeletePaper);

module.exports = router;
