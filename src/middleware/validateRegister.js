const ErrorHandling = require("../errors/customError");

exports.validateRegister = (req, res, next) => {
  const nickname = req.body.nickname;
  const userID = req.body.userID;
  const userPW = req.body.userPW;
  const userConfirmPW = req.body.userConfirmPW;

  try {
    /**
     * 닉네임 유효성 검증
     */
    const nickname_regexp = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]{2,6}$/; // 2자리 이상, 6자리 이하: 한글, 영문자, 숫자만 가능
    if (!nickname_regexp.test(nickname)) throw new ErrorHandling("유효한 닉네임이 아닙니다.");

    /**
     * 아이디 유효성 검증
     */
    const userID_regexp = /^[A-Za-z0-9]{8,20}$/; // 8자리 이상, 20자리 이하: 영문자, 숫자만 입력 가능
    if (!userID_regexp.test(userID)) throw new ErrorHandling("유효한 아이디가 아닙니다.");
    
    /**
     * 패스워드 유효성 검증
     */
    const userPw_regexp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,16}$/; // 10자리 이상, 16자리 이하: 영문자, 숫자, 특수문자 모두 포함해서 입력해야만 함.
    if (!userPw_regexp.test(userPW)) throw new ErrorHandling("유효한 패스워드가 아닙니다.");

    /**
     * 패스워드 비교 검증
     */
    if (!(userPW === userConfirmPW)) throw new ErrorHandling("패스워드와 패스워드 확인이 일치하지 않습니다.");

    next();

  } catch(err) {
    console.error(err);
    res.status(406).json({message: err.message});
  }
}