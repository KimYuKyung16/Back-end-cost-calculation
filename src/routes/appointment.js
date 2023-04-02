/**
 * BaseUrl: /appointment ...
 * 
 */

 const express = require("express");
 const router = express.Router();
 
 const { confirmAuthentication } = require("../middleware/confirmAuthentication")
 
 const { getMembersIDController, getTotalCostController, getMemberCostListController } = require('../controllers/appointmentController');
 
 
 
 router.get("/memberList", confirmAuthentication, getMembersIDController, getTotalCostController, getMemberCostListController); // 한 일정 당 멤버 리스트 출력
//  router.post("/addFriend", confirmAuthentication, addFriendController); // 친구 추가
//  router.get("/receivingList", confirmAuthentication, getReceivingListController); // 친구 신청 온 거 리스트 출력
//  router.post("/receivingList/accept", confirmAuthentication, acceptController); // 친구 신청 수락
 
 module.exports = router // 모듈로 리턴
 