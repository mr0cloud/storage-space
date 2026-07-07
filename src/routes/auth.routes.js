const {Router} = require("express");
const router = Router()
const authController = require("../controllers/auth.controller");
const {signupValidator, loginValidator} = require("../validators/auth.validator");
const {handleValidationErrors} = require("../middleware/validate.middleware");

router.get("/signup", authController.getSignupPage);
router.post("/signup", signupValidator , handleValidationErrors("auth/signup"), authController.postSignup);

router.get("/login", authController.getLoginPage);
router.post("/login", loginValidator, handleValidationErrors("auth/login"),  authController.postLogin);

router.post("/logout", authController.postLogout);

router.delete("/account", authController.deleteUser);

module.exports = router;

