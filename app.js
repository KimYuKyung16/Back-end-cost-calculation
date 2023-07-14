const express = require('express');
const app = express();
const cors = require('cors');
const port = 6001;
const session = require("express-session"); //세션
const MySQLStore = require('express-mysql-session')(session); //mysql 세션
const options = require('./config/db.js'); 
var sessionStore = new MySQLStore(options);
const cookieParser = require('cookie-parser');

app.use(cookieParser()); 

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // 요청, 응답에 쿠키를 포함하기 위해 필요
})); // cors 에러 해결 위해 추가

/* 세션 관련 미들웨어 */
app.use( 
  session({
    key: "userCookie",
    secret: "session_cookie_secret", //쿠키를 임의로 변조하는 것을 방지하기 위한 값
    store: sessionStore,
    resave: false, //세션에 변경사항이 없어도 항상 저장할 지 설정하는 값
    saveUninitialized: false,
    cookie: { maxAge: 600000},
    // rolling: false // 로그인 상태에서 다른 페이지로 이동 할 때마다 세션값에 변화(maxAge 시간 변경 등)를 줄 것인지 여부
  })
);

app.use(express.json()); // post나 get 등으로 요청을 받아들일 때 파싱을 위해 필요

/* 라우터 설정 */
const routes = require('./src/routes');
app.use('/', routes);

// 리액트에서 이미지 적용하기 위해서 필요
app.use('/profile',express.static(__dirname + '/profile'));

app.listen(port, () => {
  console.log('서버 실행 중 ...');
})


