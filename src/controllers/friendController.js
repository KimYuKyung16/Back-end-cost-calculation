/**
 * 친구 관련 컨트롤러
 *
 */

const { getUserList } = require("../models/friend/getUserList");
const { addFriend } = require("../models/friend/addFriend");
const { getReceivingList } = require("../models/friend/getReceivingList");
const { acceptFriend } = require("../models/friend/acceptFriend");
const { friendList } = require("../models/friend/friendList");
const { deleteFriend } = require("../models/friend/deleteFriend");
const { getSearchedFriendList } = require("../models/friend/getSearchedFriendList");

const ErrorHandling = require("../errors/clientError");
const ServerErrorHandling = require("../errors/serverError");

/**
 * 전체 유저 리스트 출력 컨트롤러
 */
exports.userListController = (req, res) => {
  const search = `${req.query.searchVal}%`; // 검색 단어
  const userID = req.session.userID; // 현재 로그인된 아이디

  let values = [userID, userID, userID, userID, search];

  if (req.query.searchVal === "") res.send([]);
  else {
    try {
      getUserList(values, (result, err) => {
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        res.send(result);
      });
    } catch (err) {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    }
  }
};

/**
 * 친구 추가 컨트롤러
 */
exports.addFriendController = (req, res) => {
  const receiver = req.body.receiver;
  const sender = req.session.userID;

  if (!receiver)
    throw new ErrorHandling("존재하지않는 유저입니다. 다시 시도해주세요.");

  let additionInfo = [sender, receiver, "waiting"]; // mysql에 넣을 값 : [보내는 사람, 받는 사람, 친구 상태]

  try {
    addFriend(additionInfo, (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      res.send();
    });
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 친구 신청 온 거 리스트 출력 컨트롤러
 */
exports.getReceivingListController = (req, res) => {
  let values = [req.session.userID];

  try {
    getReceivingList(values, (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      res.send(result);
    });
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 친구 신청 수락 컨트롤러
 */
exports.acceptController = (req, res) => {
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  let insertvalue = [
    [sender, receiver],
    [receiver, sender],
  ];
  let deleteValue = [sender, receiver];

  try {
    acceptFriend(insertvalue, deleteValue, (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      res.send();
    });
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 친구 리스트 출력 컨트롤러
 */
exports.friendListController = async (req, res) => {
  try {
    const userID = req.session.userID; // 현재 로그인된 아이디

    const list = await friendList([userID, userID]);
    if (list.message) throw new ServerErrorHandling(list.message);
    res.send(list);
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 친구 리스트 출력 (검색) 컨트롤러
 */
exports.searchedFriendListController = async (req, res) => {
  try {
    const search = `${req.query.searchVal}%`; // 검색 단어
    const userID = req.session.userID; // 현재 로그인된 아이디

    const result = await getSearchedFriendList([userID, userID, search]);
    if (result.message) throw new ServerErrorHandling("db에 오류가 있습니다.");
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 친구 리스트에서 친구 삭제 컨트롤러
 */
exports.deleteFriendController = async (req, res) => {
  try {
    const friendID = req.params.userID;
    const userID = req.session.userID;

    const result = await deleteFriend([userID, friendID, userID, friendID]);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send({ state: "success" });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

