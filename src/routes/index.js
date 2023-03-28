const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const friendRoute = require("./friend"); 



router.use("/auth", authRoute); //  로그인 관련 라우터
router.use("/friend", friendRoute); //  친구 관련 라우터


module.exports = router // 모듈로 리턴