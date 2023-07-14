let ErrorHandling = require("../errors/clientError");

exports.validateLogin = (req, res, next) => {
  const userID = req.body.userID;
  const userPW = req.body.userPW;

  try {
    /**
     * 아이디 유효성 검증
     */
    const userID_regexp = /^[A-Za-z0-9]{8,20}$/; // 8자리 이상, 20자리 이하: 영문자, 숫자만 입력 가능
    if (!userID_regexp.test(userID))
      throw new ErrorHandling("유효한 아이디가 아닙니다.");

    /**
     * 패스워드 유효성 검증
     */
    const userPw_regexp =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,16}$/; // 10자리 이상, 16자리 이하: 영문자, 숫자, 특수문자 모두 포함해서 입력해야만 함.
    if (!userPw_regexp.test(userPW))
      throw new ErrorHandling("유효한 패스워드가 아닙니다.");

    next();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};
