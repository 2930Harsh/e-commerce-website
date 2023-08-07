const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword, 
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateRole} = require('../controllers/userController');
const router = express.Router();
const {isAuthenticatedUser,authorizRoles} = require('../middleware/auth')

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);

router.route("/admin/users")
.get(isAuthenticatedUser,authorizRoles("admin") ,getAllUsers);

router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizRoles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizRoles("admin"),updateRole)
.delete(isAuthenticatedUser,authorizRoles("admin"),deleteUser)

module.exports = router;