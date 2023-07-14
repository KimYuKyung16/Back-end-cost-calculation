const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const userRoute = require("./user");
const friendRoute = require("./friend"); 
const appointmentRoute = require("./calculate"); 
const costRoute = require("./cost"); 
const messageRoute = require("./message"); 


router.use("/auth", authRoute); // 로그인 관련 라우터
router.use("/user", userRoute); // 유저 관련 라우터
router.use("/friend", friendRoute); // 친구 관련 라우터
router.use("/calculate", appointmentRoute); // 정산 관련 라우터
router.use("/cost", costRoute); // 비용 관련 라우터
router.use("/message", messageRoute); // 쪽지 관련 라우터


module.exports = router // 모듈로 리턴