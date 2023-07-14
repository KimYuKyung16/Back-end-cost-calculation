const {
  getMessageListCount,
  getMessageList,
} = require("../models/message/getMessageList");
const {
  changeMessageReadable,
} = require("../models/message/changeMessageReadable");
const { deleteMessage } = require("../models/message/deleteMessage");
const { deleteAllMessage } = require("../models/message/deleteAllMessage");
const { getNonReadMessageCount } = require("../models/message/getNonReadMessage");


const ServerErrorHandling = require("../errors/serverError");

/**
 * 메시지 리스트 출력 컨트롤러
 */
exports.messageListController = async (req, res) => {
  try {
    const count = await getMessageListCount(req.session.userID);
    if (count.message) throw new ServerErrorHandling("db에 오류가 있습니다.");

    let total_messages = count[0].count; // 전체 쪽지 개수
    let one_page_messages = 8; // 한 페이지당 쪽지 개수

    let total_pages = parseInt(total_messages / one_page_messages); // 총 페이지 개수
    let remain_messages = total_messages % one_page_messages; // 나머지 쪽지 개수
    remain_messages ? (total_pages += 1) : total_pages; // 나머지 쪽지이 있으면 페이지 개수 추가

    let current_page = Number(req.params.current_page);
    current_page === undefined
      ? (current_page = 1)
      : (current_page = parseInt(current_page)); // 현재 페이지
    let start_value = (current_page - 1) * one_page_messages; // 시작값
    let output_num; // 출력 개수

    if (current_page == total_pages) {
      // 현재 페이지가 마지막 페이지라면
      remain_messages === 0
        ? (output_num = 20)
        : (output_num = remain_messages); // 출력 개수는 나머지 쪽지의 개수
    } else {
      // 현재 페이지가 마지막 페이지가 아니라면
      output_num = one_page_messages; // 출력 개수는 한 페이지당 쪽지의 개수
    }

    const list = await getMessageList([
      req.session.userID,
      start_value,
      output_num,
    ]);
    if (list.message) throw new ServerErrorHandling(list.message);

    res.send({ total_pages, list });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 메시지 읽음 표시 변경 컨트롤러
 */
exports.messageReadableController = async (req, res) => {
  try {
    const num = req.body.num;
    const result = await changeMessageReadable(num);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send();
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 메시지 삭제 컨트롤러
 */
exports.deleteMessageController = async (req, res) => {
  try {
    const num = req.params.num;
    const result = await deleteMessage(num);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send();
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 메시지 전체 삭제 컨트롤러
 */
exports.deleteAllMessageController = async (req, res) => {
  try {
    const result = await deleteAllMessage(req.session.userID);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send();
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 안읽은 메시지 개수 가져오는 컨트롤러
 */
exports.nonReadMessageController = async (req, res) => {
  try {
    const result = await getNonReadMessageCount([req.session.userID]);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send({count: result[0].messageCount});
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

