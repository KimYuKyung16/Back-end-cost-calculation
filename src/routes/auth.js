const express = require("express");
const router = express.Router();

const { validateRegister } = require("../middleware/validateRegister")
const { validateLogin } = require("../middleware/validateLogin");

const { registerController, loginController } = require('../controllers/auth');



router.post("/register", validateRegister, registerController); // 회원가입
router.post("/login", validateLogin, loginController); // 로그인

router.get("/logout", ); // 로그아웃

module.exports = router // 모듈로 리턴
