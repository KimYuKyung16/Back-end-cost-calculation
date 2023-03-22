const express = require("express");
const router = express.Router();

const authRoute = require("./auth"); 



router.use("/auth", authRoute); //  로그인과 관련된 라우터


module.exports = router // 모듈로 리턴