const {Router} = require("express");
const router = Router()
const authController = require("../controllers/auth.controller");

router.get("/signup", authController.getSignupPage);
router.post("/signup", authController.postSignup);

router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.delete("/account", authController.deleteUser);

module.exports = router;

