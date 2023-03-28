/**
 * BaseUrl: /friend ...
 * 
 */

const express = require("express");
const router = express.Router();

const { confirmAuthentication } = require("../middleware/confirmAuthentication")

const { userListController, addFriendController, getReceivingListController, acceptController } = require('../controllers/friendController');



router.get("/userList", confirmAuthentication, userListController); // 친구 검색할 때의 전체 유저 리스트 출력
router.post("/addFriend", confirmAuthentication, addFriendController); // 친구 추가
router.get("/receivingList", confirmAuthentication, getReceivingListController); // 친구 신청 온 거 리스트 출력
router.post("/receivingList/accept", confirmAuthentication, acceptController); // 친구 신청 수락

module.exports = router // 모듈로 리턴
