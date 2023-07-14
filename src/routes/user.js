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
  getUserInfoController,
  changeProfileController
} = require("../controllers/userController");

const fs = require('fs');
const path = require("path");
const multer = require('multer');

try {
	fs.readdirSync('profile'); // 폴더 확인: 프로필 저장할 폴더
} catch(err) {
	console.error('profile 폴더가 없습니다. 폴더를 생성합니다.');
  fs.mkdirSync('profile'); // 폴더 생성
}

const upload = multer({
  storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
      destination(req, file, done) { // 저장 위치
          done(null, 'profile/'); // uploads라는 폴더 안에 저장
      },
      filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
          const ext = path.extname(file.originalname); // 파일의 확장자 (originalname, fieldname)
          done(null, path.basename(file.fieldname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
      }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
});


router.get("/", confirmAuthentication, getUserInfoController); // 로그인 된 사람 정보
router.post("/profile", confirmAuthentication, upload.single('uploadImage'), changeProfileController); // 프로필 변경


module.exports = router; // 모듈로 리턴
