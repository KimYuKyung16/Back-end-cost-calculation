/**
 * 친구 관련 컨트롤러
 * 
 */

 const { getUserList } = require("../models/friend/getUserList");
 const { addFriend } = require("../models/friend/addFriend");
 const { getReceivingList } = require("../models/friend/getReceivingList");
 const { acceptFriend } = require("../models/friend/acceptFriend");
 
 const ErrorHandling = require("../errors/clientError");
 const ServerErrorHandling = require("../errors/serverError");
 
 
 /**
  * 전체 유저 리스트 출력 컨트롤러
  */
exports.userListController = (req, res) => { 
  const search = `${req.query.searchVal}%`; // 검색 단어
  const userID = req.session.userID; // 현재 로그인된 아이디

  let values = [userID, userID, userID, userID, search];

  if (req.query.searchVal === '') res.send([]);
  else {
    try {
      getUserList(values, (result, err) => {
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        res.send(result);
      });  
    } catch (err) {
      console.error(err);
      res.status(err.stauts).json({message: err.message});
    }
  }
}

/**
 * 친구 추가 컨트롤러
 */
 exports.addFriendController = (req, res) => { 
  const receiver = req.body.receiver;
  const sender = req.session.userID;

  if (!receiver) throw new ErrorHandling("존재하지않는 유저입니다. 다시 시도해주세요.");

  let additionInfo = [sender, receiver, 'waiting']; // mysql에 넣을 값 : [보내는 사람, 받는 사람, 친구 상태]

  try {
    addFriend(additionInfo, (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      res.send();
    });  
  } catch(err) {
    console.error(err);
    res.status(err.stauts).json({message: err.message});
  }
}


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
    res.status(err.stauts).json({message: err.message});
  }
}


/**
* 친구 신청 수락 컨트롤러
*/
exports.acceptController = (req, res) => { 
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  let insertvalue = [[sender, receiver], [receiver, sender]];
  let deleteValue = [sender, receiver];

  try {
    acceptFriend(insertvalue, deleteValue, (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      res.send();
    });  
  } catch (err) {
    console.error(err);
    res.status(err.stauts).json({message: err.message});
  }
}
 
 