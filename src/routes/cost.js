/**
 * BaseUrl: /cost...
 *
 */

const express = require("express");
const router = express.Router();
const {
  confirmAuthentication,
} = require("../middleware/confirmAuthentication");
const {
  getCostListController,
  addCostController,
  deleteCostController,
  modifyCostController
} = require("../controllers/costController");

router.get("/list", confirmAuthentication, getCostListController); // 지출 리스트 출력
router.post("/", confirmAuthentication, addCostController); // 지출 추가
router.put("/:num", confirmAuthentication, modifyCostController); // 지출 수정
router.delete(`/:num`, confirmAuthentication, deleteCostController); // 지출 삭제

module.exports = router; // 모듈로 리턴
