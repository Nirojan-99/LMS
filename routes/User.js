const Router = require("express").Router;
const router = Router();
const fileUpload = require("express-fileupload");
router.use(fileUpload());
const Profile = require("../Controller/User");


router.post("/login", Profile.Login);

router.get("/check_mail/", Profile.CheckMail);

router.post("/check_otp", Profile.CheckOTP);

router.post("/find_user", Profile.FindUser);

router.get("/get_user/", Profile.GetUser);

router.post("/edit_user", Profile.EditUser);

router.post("/add_dp", Profile.AddDP);

router.get("/dp/", Profile.GetDP);

router.delete("/delete_user/", Profile.DeleteUser);

router.get("/get_modules/", Profile.GetModules);

router.post("/unenroll", Profile.Unenroll);

router.post("/reset_password", Profile.ResetPass);

router.get("/check_pass_reset_validity/", Profile.CheckValidity);

// router.get("/getpassword/", Profile.GetPassword);


module.exports = router;
