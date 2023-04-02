const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const friendRoute = require("./friend"); 
const appointmentRoute = require("./appointment"); 
const costRoute = require("./cost"); 



router.use("/auth", authRoute); // 로그인 관련 라우터
router.use("/friend", friendRoute); // 친구 관련 라우터
router.use("/appointment", appointmentRoute); // 일정 관련 라우터
router.use("/cost", costRoute); // 비용 관련 라우터


module.exports = router // 모듈로 리턴