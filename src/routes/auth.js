/**
 * BaseUrl: /auth ...
 *
 */
const express = require("express");
const router = express.Router();
const {
  confirmAuthentication,
} = require("../middleware/confirmAuthentication");
const { validateRegister } = require("../middleware/validateRegister");
const { validateLogin } = require("../middleware/validateLogin");
const {
  registerController,
  loginController,
  authenticationController,
  logoutController,
} = require("../controllers/authController");

router.get("/authentication", authenticationController); // 로그인 여부 확인
router.post("/register", validateRegister, registerController); // 회원가입
router.post("/login", validateLogin, loginController); // 로그인
router.get("/logout", confirmAuthentication, logoutController); // 로그아웃

module.exports = router; // 모듈로 리턴
