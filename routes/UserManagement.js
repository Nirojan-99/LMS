const Router = require("express").Router;
const router = Router();

const UserManagement=require("../Controller/UserManagement");



router.post("/get_userID/",UserManagement.GetUserID);

router.post("/add_user/",UserManagement.AddUser);

router.post("/get_users/",UserManagement.GetUsers);

router.post("/edit_user/",UserManagement.EditUser);

router.post("/update_user/",UserManagement.UpdateUser);

router.post("/delete_user/",UserManagement.DeleteUser);

module.exports = router;
