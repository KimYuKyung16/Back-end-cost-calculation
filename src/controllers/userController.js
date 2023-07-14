const {
  getMessageListCount,
  getMessageList,
} = require("../models/message/getMessageList");
const {
  changeMessageReadable,
} = require("../models/message/changeMessageReadable");
const { getUserInfo } = require("../models/user/getUserInfo");
const { changeProfile } = require("../models/user/changeProfile");

const ServerErrorHandling = require("../errors/serverError");

/**
 * 로그인된 유저 정보를 가져오는 컨트롤러
 */
exports.getUserInfoController = async (req, res) => {
  try {
    const userInfo = await getUserInfo(req.session.userID);
    if (userInfo.message) throw new ServerErrorHandling(userInfo.message);
    res.send({profile: userInfo[0].profile, nickname: userInfo[0].nickname});
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 유저의 프로필을 변경하는 컨트롤러
 */
exports.changeProfileController = async (req, res) => {
  try {
    const profileFile = 'http://localhost:6001/' + req.file.path;
    const nickname = req.body.nickname;

    const result = await changeProfile([profileFile, nickname, req.session.userID]);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send({url: profileFile});
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};