const Router = require("express").Router;
const router = Router();

const UserManagement=require("../Controller/UserManagement");



router.get("/get_userID/",UserManagement.GetUserID);

router.post("/add_user/",UserManagement.AddUser);

router.get("/get_users/",UserManagement.GetUsers);

router.get("/edit_user/",UserManagement.EditUser);

router.post("/update_user/",UserManagement.UpdateUser);

router.post("/delete_user/",UserManagement.DeleteUser);

module.exports = router;
