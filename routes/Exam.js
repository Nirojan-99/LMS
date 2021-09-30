const Router = require("express").Router;
const router = Router();
const Exam = require("../Controller/Exam");

router.post("/newExam", Exam.AddExam);
router.get("/getAllExams", Exam.getAllExams);
router.get("/getExam", Exam.getExam);
router.put("/updateExam", Exam.updateExam);
router.delete("/deleteExam", Exam.deleteExam);

module.exports = router;