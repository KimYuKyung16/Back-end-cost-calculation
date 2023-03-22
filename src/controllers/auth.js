/**
 * 로그인 관련 컨트롤러
 * 
 */

const bcrypt = require('bcrypt'); // 단방향 암호화를 위한 bcrypt 모듈
const { addUser } = require("../models/auth/addUser");
const { findUser } = require("../models/auth/findUser");

const ErrorHandling = require("../errors/customError");


/**
 * 회원가입 컨트롤러
 */
exports.registerController = (req, res) => { 
  const nickname = req.body.nickname;
  const userID = req.body.userID;
  const userPW = req.body.userPW;

  const encryptedPw = bcrypt.hashSync(userPW, 10); // 암호화된 비밀번호: 솔트를 10번 돌림, Sync가 붙어서 동기 방식
  let registerInfo = [nickname, userID, encryptedPw]; // mysql에 넣을 값 : [닉네임, 아이디, 암호화된 비밀번호]

  /* 유저 추가하는 sql 쿼리 작업 */
  try {
    addUser(registerInfo, (result, err) => {
      if (err) throw new ErrorHandling("db에 오류가 있습니다.");
    });  
    res.send();
  } catch(err) {
    console.error(err);
    res.status(406).json({message: err.message});
  }
}


/**
 * 로그인 컨트롤러
 */
exports.loginController = (req, res) => { 
  const userID = req.body.userID;
  const userPW = req.body.userPW;

  let loginInfo = [userID]; // mysql에 넣을 값 : [닉네임]

  /* 존재하는 유저인지 확인하는 sql 쿼리 작업 */
  findUser(loginInfo, (result, err) => {
    try {
      if (err) throw new ErrorHandling("db에 오류가 있습니다.");

      if (!result.length) throw new ErrorHandling("존재하지 않는 유저입니다."); // 아이디가 없을 경우

      const same = bcrypt.compareSync(userPW, result[0].pw); // 패스워드 비교값
      if (!same) throw new ErrorHandling("패스워드가 일치하지 않습니다.");

      req.session.authenticator = 'true'; // 인증된 사용자 여부 저장
      // req.session.nickname = rows[0].nickname; // 세션에 닉네임 저장
      // req.session.userID = rows[0].id; // 세션에 아이디 저장
      req.session.cookie.maxAge = 3000 * 60 * 60; // 세션 만료 시간을 1시간으로 설정 (단위: ms, 1000은 1초)

      req.session.save(() => { // 세션이 저장되면
        res.send();
        // res.send({'login_status': 'success', 'nickname': rows[0].nickname, 'profile': rows[0].profile});
      });

    } catch (err) {
      console.error(err);
      res.status(406).json({message: err.message});
    }
  });  
}