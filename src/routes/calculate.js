/**
 * BaseUrl: /calculate ...
 *
 */

const express = require("express");
const router = express.Router();
const {
  confirmAuthentication,
} = require("../middleware/confirmAuthentication");
const {
  getCalculateController,
  addCalculateController,
  modifyCalculateController,
  deleteCalculateController,
  getMembersIDController,
  getTotalCostController,
  getMemberCostListController,
  getMyCalculateListController,
  calculateList__type1,
  calculateList__type2,
  calculateList__type3,
  calculateList__type4,
  calculateList__type_count,
  addBookmarkController,
  deleteBookmarkController,
  getCalculateCompleteController,
  addCompleteController,
  deleteCompleteController,
  changeCompleteController
} = require("../controllers/calculateController");


// 한 일정 당 멤버 리스트 출력
router.get(
  "/memberList",
  confirmAuthentication,
  getMembersIDController,
  getTotalCostController,
  getMemberCostListController
); 

// 정산 리스트 출력 (전체, 정산중, 정산완료, 즐겨찾기, 타입별 개수)
router.get(
  "/list",
  confirmAuthentication,
  calculateList__type1,
  calculateList__type2,
  calculateList__type3,
  calculateList__type4,
  calculateList__type_count,
); 

// 내가 작성한 일정 리스트 출력
router.get(
  "/list/me/:current_page",
  confirmAuthentication,
  getMyCalculateListController
); 

// 즐겨찾기 추가
router.post(
  "/bookmark/:num",
  confirmAuthentication,
  addBookmarkController
);

// 즐겨찾기 삭제
router.delete(
  "/bookmark/:num",
  confirmAuthentication,
  deleteBookmarkController
);

// 정산 완료와 관련된 내용 가져오기
router.get(
  "/:num/complete",
  confirmAuthentication,
  getCalculateCompleteController
); 

// 개인별 정산완료 동의 처리
router.post(
  "/:num/complete",
  confirmAuthentication,
  addCompleteController
); 

// 개인별 정산완료 비동의 처리 
router.delete(
  "/:num/complete",
  confirmAuthentication,
  deleteCompleteController
); 

// 해당 정산을 정산 완료 또는 정산중으로 바꾸기
router.put(
  "/:num/complete/:state",
  confirmAuthentication,
  changeCompleteController
); 

// 정산 정보 가져오기
router.get(
  "/:num",
  confirmAuthentication,
  getCalculateController
); 

// 정산 저장
router.post(
  "/",
  confirmAuthentication,
  addCalculateController
); 

// 정산 수정
router.put(
  "/:num",
  confirmAuthentication,
  modifyCalculateController
); 

// 정산 삭제
router.delete(
  "/:num",
  confirmAuthentication,
  deleteCalculateController
); 

module.exports = router; // 모듈로 리턴
