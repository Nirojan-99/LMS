const Router = require("express").Router;
const router = Router();
const Exam = require("../Controller/ExamMarks");

router.post("/newExamMark", Exam.AddExamMark);
router.get("/getAllExamMarks", Exam.getAllExamMarks);
router.get("/getExamMark", Exam.getExamMark);
router.put("/updateExamMark", Exam.updateExamMark);
router.delete("/deleteExamMark", Exam.deleteExamMark);

module.exports = router;