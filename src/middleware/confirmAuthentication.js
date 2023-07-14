const SessionErrorHandling = require("../errors/sessionError");

/**
 * 로그인 여부 확인
 */
exports.confirmAuthentication = (req, res, next) => {
  try {
    // 세션이 있다면 인증O, 로그인 상태O
    if (!req.session.authenticator)
      throw new SessionErrorHandling("로그인이 되어있지 않습니다.");
    next();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};
