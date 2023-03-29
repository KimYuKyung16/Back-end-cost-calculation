/**
 * BaseUrl: /friend ...
 * 
 */

 const express = require("express");
 const router = express.Router();
 
 const { confirmAuthentication } = require("../middleware/confirmAuthentication")
 
 const { getCostListController ,addCostController } = require('../controllers/costController');
 
 
 router.get("/list", confirmAuthentication, getCostListController) // 정산 리스트 출력
 router.post("/", confirmAuthentication, addCostController); // 정산 추가
 

 
 module.exports = router // 모듈로 리턴
 