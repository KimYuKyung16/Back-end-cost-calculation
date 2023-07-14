/**
 * BaseUrl: /message ...
 *
 */

const express = require("express");
const router = express.Router();

const {
  confirmAuthentication,
} = require("../middleware/confirmAuthentication");

const {
  messageListController,
  messageReadableController,
  deleteMessageController,
  deleteAllMessageController,
  nonReadMessageController,
} = require("../controllers/messageController");

router.get("/nonRead", confirmAuthentication, nonReadMessageController); // 안읽은 메시지 개수
router.get("/:current_page", confirmAuthentication, messageListController); // 메시지 출력
router.put("/", confirmAuthentication, messageReadableController); // 메시지 읽음 표시 변경
router.delete("/:num", confirmAuthentication, deleteMessageController); // 메시지 삭제
router.delete("/", confirmAuthentication, deleteAllMessageController); // 메시지 전체 삭제

module.exports = router; // 모듈로 리턴
