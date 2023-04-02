const express = require('express');
const app = express();
const cors = require('cors');
const port = 6001;

const bcrypt = require('bcrypt');

const { parseCookies } = require('./cookieparse.js'); // 쿠키 파싱

const mysql = require('mysql'); // mysql 모듈
const mysql2 = require('mysql2/promise'); // mysql 모듈

const pool = mysql2.createPool({ 
  host: "localhost",
  port: 8000,
  user: "root",
  password: "3909",
  database: "cost_calculation",
});

const dbconfig = require('./config/db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

// const bcrypt = require('bcrypt'); // 단방향 암호화를 위한 bcrypt 모듈

const session = require("express-session"); //세션
const MySQLStore = require('express-mysql-session')(session); //mysql 세션

const options = require('./config/db.js'); 
var sessionStore = new MySQLStore(options);

const cookieParser = require('cookie-parser');

app.use(cookieParser()); 

var fs = require('fs');
const path = require("path");
var multer = require('multer');
const { async } = require('@firebase/util');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // 요청, 응답에 쿠키를 포함하기 위해 필요
})); // cors 에러 해결 위해 추가

// app.use(cookieParser()); 

/* 세션 관련 미들웨어 */
app.use( 
  session({
    key: "userCookie",
    secret: "session_cookie_secret", //쿠키를 임의로 변조하는 것을 방지하기 위한 값
    store: sessionStore,
    resave: false, //세션에 변경사항이 없어도 항상 저장할 지 설정하는 값
    saveUninitialized: false,
    cookie: { maxAge: 60000},
    // rolling: false // 로그인 상태에서 다른 페이지로 이동 할 때마다 세션값에 변화(maxAge 시간 변경 등)를 줄 것인지 여부
  })
);


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

app.use(express.json()); // post나 get 등으로 요청을 받아들일 때 파싱을 위해 필요



/* 라우터 설정 */

// 로그인 관련 라우터들
// const logout = require("./routes/auth"); // 로그아웃 메뉴




// const login = require("./src/routes/auth.js"); // 로그인 메뉴
// const register = require("./src/routes/auth.js"); // 회원가입 메뉴
// const getUserList = require("./src/routes/friend"); // 회원가입 메뉴
// app.use('/auth', login);
// app.use('/auth', register);
// app.use('/friend', getUserList)
const routes = require('./src/routes');

app.use('/', routes);




// app.use('/board', board);

// app.use('/logout', logout);

// app.use('/user_info', user_info);
// app.use('/write', write);
// app.use('/plant_info', plant_info);
// app.use('/plant_album', plant_album);

// app.use('/chat', chat);

















// const checkNum = /[0-9]/;  // 숫자 
// const checkEng = /[a-zA-Z]/; // 영어
// const checkKor = /[가-힣]/; // 한글체크 : /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
// const checkSpc = /[~!@#$%^&*_]/; // 특수문자
// const checkBlank = /\s/g; // 공백 + 탭 : str.match(pattern)


/* 회원가입 */
// app.post('/signup', function(req, res){
//   const nickname = req.body.nickname;
//   const userID = req.body.userID;
//   const userPW = req.body.userPW;
//   const userConfirmPW = req.body.userConfirmPW;

//   let conditionNickname = (!checkSpc.test(nickname) && !nickname.match(checkBlank)); // 닉네임: 특수문자X, 공백X
//   let conditionID = (!checkKor.test(userID) && !nickname.match(checkBlank) && !checkSpc.test(nickname)); // 아이디: 한글X, 공백X, 특수문자X
//   let conditionPW = (!checkKor.test(userID) && !nickname.match(checkBlank)); // 패스워드: 한글X, 공백X

//   /* 조건 설정 */
//   let checkNickname = (nickname.length >= 2 && nickname.length <= 10 && conditionNickname); // 닉네임 조건
//   let checkID = (userID.length >= 5 && userID.length <= 12 && conditionID); // id 조건
//   let checkuserPW = (userPW.length >= 10 && userPW.length <= 15 && conditionPW); // pw 조건
//   let checkuserConfirmPW = (userPW === userConfirmPW); // pw 확인 조건

//   if (checkNickname && checkID && checkuserPW && checkuserConfirmPW) { // 회원가입 폼이 조건에 충족할 경우
//     const encryptedPw = bcrypt.hashSync(userPW, 10); // 암호화된 비밀번호: 솔트를 10번 돌림, Sync가 붙어서 동기 방식
//     let insertValArr = [nickname, userID, encryptedPw]; // mysql에 넣을 배열값 : [닉네임, 아이디, 암호화된 비밀번호]
//     let sql = "INSERT INTO users (nickname, id, pw) VALUES (?, ?, ?)";

//     connection.query(sql, insertValArr, function(error, rows){
//       if (error) throw error;
//       res.send({status: true});
//     })
//   } else { // 조건에 충족하지 않을 경우
//     res.send({status: false});
//   }
// });


/* 로그인 */
// app.get('/login', function(req, res){
//   let userID = req.body.userID;
//   let userPW = req.body.userPW;

//   let sql = "SELECT * FROM users WHERE id = ?";

//   connection.query(sql, userID, function(error, rows) {
//     if (error) throw error;

//     if (rows.length == 0) { // 아이디가 없을 경우
//       console.log("존재하지않는 회원입니다");
//       res.send({'login_status' : 'fail'});
//     } else { // 아이디가 존재할 경우
//       const same = bcrypt.compareSync(userPW, rows[0].pw); // 패스워드 비교값
//       if (same == true) { // 입력받은 패스워드와 db에 저장된 패스워드가 일치할 경우
//         console.log("회원입니다. 로그인에 성공하셨습니다");

//         req.session.authenticator = 'true'; // 인증된 사용자 여부 저장
//         req.session.nickname = rows[0].nickname; // 세션에 닉네임 저장
//         req.session.userID = rows[0].id; // 세션에 아이디 저장
//         req.session.cookie.maxAge = 3000 * 60 * 60; // 세션 만료 시간을 1시간으로 설정 (단위: ms, 1000은 1초)
//         // req.session.cookie.expires = expires;

//         req.session.save(() => { // 세션이 저장되면
//           res.send({'login_status': 'success', 'nickname': rows[0].nickname, 'profile': rows[0].profile});
//         });
//       } else { // 패스워드가 틀렸을 경우
//         console.log("패스워드가 틀렸습니다");
//         res.send({'login_status': 'fail'});
//       }
//     } 
//   });
// })


/* 2. 로그인된 회원이 맞는지 확인 */
// app.get('/authentication', function(req, res){ 
//   console.log(req);
//   console.log(req.session)
//   if (req.session.authenticator) { // 세션이 있다면 인증O, 로그인 상태O
//     res.send({'authenticator': true, 'nickname': req.session.nickname, 'user_id':req.session.user_id});
//   } else {
//     res.send({'authenticator': false});
//   }
// })

app.get('/userInfo', function(req, res){ // 메인 화면에서 로그인된 사람 정보 출력
  if (req.session.authenticator) { // 세션이 있다면 인증O, 로그인 상태O
    let sql = 'SELECT * FROM users WHERE id = ?'
    connection.query(sql, req.session.userID, function(error, rows){
      if (error) throw error;
      res.send({profile: rows[0].profile, nickname: rows[0].nickname});
    })
  }
})


// app.get('/userList', function(req, res){ // 메인 화면에서 로그인된 사람 정보 출력
//   let search = `${req.query.searchVal}%`; // 검색 단어
//   let userID = req.session.userID; // 현재 로그인된 아이디

//   if (req.session.authenticator) { // 세션이 있다면 인증O, 로그인 상태O
//     if (req.query.searchVal === '') res.send([]);
//     else {
//       let sql = `SELECT * FROM users AS u
//       LEFT JOIN friendlist AS f ON u.id = f.friendID AND f.userID = ?
//       LEFT JOIN friendwaitinglist AS w ON (u.id = w.receiver AND w.sender = ?) OR (u.id = w.sender AND w.receiver = ?)
//       WHERE u.id NOT IN (?) AND u.id LIKE ?`;
//       let insertValArr = [userID, userID, userID, userID, search];
//       connection.query(sql, insertValArr, function(error, rows){
//         if (error) throw error;
//         console.log(rows)
//         res.send(rows);
//       })
//     }

//   }
// })


// app.post('/userList/addFriend', function(req, res){ // 메인 화면에서 로그인된 사람 정보 출력
//   if (req.session.authenticator) { // 세션이 있다면 인증O, 로그인 상태O
//     let receiver = req.body.receiver;
//     let sender = req.session.userID;

//     let sql = 'INSERT INTO friendwaitinglist (sender, receiver, state) VALUES (?, ?, ?)'; 
//     let insertValArr = [sender, receiver, 'wating'];
//     connection.query(sql, insertValArr, function(error, rows){
//       if (error) throw error;
//       res.send(rows);
//     })
//   }
// })

app.get('/waitingList', function(req, res){ // 대기 리스트 출력
  console.log(req.session.authenticator)
  if (req.session.authenticator) { // 세션이 있다면 인증O, 로그인 상태O
    // let sql = 'SELECT * FROM friendwaitinglist WHERE sender = ?'
    let sql = `SELECT * FROM friendwaitinglist AS W
    INNER JOIN users AS U
    ON U.id = W.receiver WHERE sender = ?`;
    connection.query(sql, req.session.userID, function(error, rows){
      if (error) throw error;
      res.send(rows);
    })
  }
})

// app.get('/receivingList', function(req, res){ // 친구 신청 온 거 리스트 출력
//   if (req.session.authenticator) { // 세션이 있다면 인증O, 로그인 상태O
//     let sql = `SELECT * FROM friendwaitinglist AS W
//     INNER JOIN users AS U
//     ON U.id = W.sender WHERE receiver = ?`
//     connection.query(sql, req.session.userID, function(error, rows){
//       if (error) throw error;
//       res.send(rows);
//     })
//   }
// })

app.get('/friendList', function(req, res){ // 친구 리스트 출력
  console.log(req.session.authenticator)
  if (req.session) {
    let search = `${req.query.searchVal}%`; // 검색 단어
    let userID = req.session.userID; // 현재 로그인된 아이디

    console.log('검색값:', search)

    let sql = `SELECT id, nickname, profile FROM friendlist AS f 
    LEFT JOIN users AS u ON u.id = f.friendID AND f.userID = ?
    WHERE u.id NOT IN (?)`;

    let insertValArr = [userID, userID];
    connection.query(sql, insertValArr, function(error, rows){
      if (error) throw error;
      res.send(rows);
    })
  }
})

app.delete('/friendList', function(req, res){ // 친구 리스트에서 친구 삭제
  console.log(req.session.authenticator)
  if (req.session) {
    const friendID = req.query.id;
    const userID = req.session.userID;

    let sql = 'DELETE FROM friendlist WHERE userID = ? AND friendID = ? OR friendID = ? AND userID = ?'
    let insertValArr = [userID, friendID, userID, friendID];

    connection.query(sql, insertValArr, function(error, rows){
      if (error) throw error;
      res.send({state: 'success'});
    })
  }
})





app.get('/searchFriendList', function(req, res){ // 친구 리스트 출력 (검색)
  console.log(req.session.authenticator)
  if (req.session) {
    let search = `${req.query.searchVal}%`; // 검색 단어
    let userID = req.session.userID; // 현재 로그인된 아이디

    console.log('검색값:', search)

    let sql = `SELECT id, nickname, profile FROM friendlist AS f 
    LEFT JOIN users AS u ON u.id = f.friendID AND f.userID = ?
    WHERE u.id NOT IN (?) and u.id LIKE ?`;

    let insertValArr = [userID, userID, search];
    connection.query(sql, insertValArr, function(error, rows){
      if (error) throw error;
      console.log(rows);
      res.send(rows);
    })
  }
})


// app.post('/friend/receivingList/accept', function(req, res){ // 친구 신청 수락 버튼을 눌렀을 때
//   let sender = req.body.sender;
//   let receiver = req.body.receiver;

//   // let valueList = [[sender, receiver], [receiver, sender]];
//   for (i=0; i<2; i++) {
//     sql = 'INSERT INTO friendlist (userID, friendID) VALUES (?, ?)'; 
//     connection.query(sql, valueList[i], function(error, rows){
//       if (error) throw error;
//     })
//   }

//   sql = 'DELETE FROM friendwaitinglist WHERE sender = ? AND receiver = ?';
//   // insertValArr = [sender, receiver];
//   connection.query(sql, insertValArr, function(error, rows){
//     if (error) throw error;
//     res.send();
//   }) 
// })



app.get('/appointment_title', (req, res) => {
  console.log('num값:', req.query.num)
  let sql = 'SELECT calculate_name FROM calculate_list WHERE num = ?';
  connection.query(sql, req.query.num, function(error, rows){ // 비회원 생성
    if (error) throw error;
    console.log(rows);
    res.send({title: rows[0].calculate_name})
  })
})



// app.post('/appointment', function(req, res){ // 약속 저장
//   let name = req.body.name;
//   let members = req.body.members;
//   let members_idList = [];

//   /* 비회원일 경우 */
//   for (let i=0; i<members.length; i++) {
//     if (!members[i].id) { // userID가 없을 경우: 비회원
//       console.log(members[i])
//       let non_userID = bcrypt.hashSync(members[i].nickname, 10); // 해시값으로 만든 비회원 아이디
//       members[i].id = non_userID; 

//       let insertValArr = [non_userID, members[i].nickname];
//       let sql = "INSERT INTO non_users (id, nickname) VALUES (?, ?)";
//       connection.query(sql, insertValArr, function(error, rows){ // 비회원 생성
//         if (error) throw error;
//       })
//     }
//   }

//   members_idList.push(req.session.userID); // 본인 아이디도 추가
//   for (x of members) members_idList.push(x.id); // 아이디만 추출
//   let string_members_idList = JSON.stringify(members_idList);

//   if (req.session) { 
//     let insertValArr = [req.session.userID, name, string_members_idList];
//     let sql = "INSERT INTO calculate_list (id, calculate_name, members) VALUES (?, ?, ?)";
//     connection.query(sql, insertValArr, function(error, rows){
//       if (error) throw error;
//       res.send();
//     })
//   }
// })

app.post('/appointment', async function(req, res){ // 약속 저장
  let connection = await pool.getConnection(async(conn) => conn);

  let name = req.body.name;
  let date = req.body.date;
  let time = req.body.time;
  let members = req.body.members;
  let members_idList = [];

  console.log("들어옴")

  /* 비회원일 경우 */
  for (let i=0; i<members.length; i++) {
    if (!members[i].id) { // userID가 없을 경우: 비회원
      console.log(members[i])
      let non_userID = bcrypt.hashSync(members[i].nickname, 10); // 해시값으로 만든 비회원 아이디
      members[i].id = non_userID; 

      let insertValArr = [non_userID, members[i].nickname];
      let sql = "INSERT INTO non_users (id, nickname) VALUES (?, ?)";
      connection.query(sql, insertValArr, function(error, rows){ // 비회원 생성
        if (error) throw error;
      })
    }
  }

  let insertValArr = [req.session.userID, name, date, time];
  let sql = "INSERT INTO calculate_list (id, calculate_name, date, time) VALUES (?, ?, ?, ?)";
  await connection.query(sql, insertValArr);

  // 위에서 저장한 약속에 해당하는 num값 가져오기
  insertValArr = [name, date, time];
  sql = "SELECT num FROM calculate_list WHERE calculate_name = ? AND date = ? AND time = ?";
  let [numData] = await connection.query(sql, insertValArr);
  let num = numData[0].num;


  members_idList.push([num, req.session.userID]); // 본인 아이디도 추가
  for (x of members) members_idList.push([num, x.id]); // 아이디만 추출

  console.log(members_idList)

  insertValArr = [members_idList];
  sql = "INSERT INTO calculate_list_members (calculate_list_num, member) VALUES ?";
  await connection.query(sql, insertValArr);

  res.send();
})

// const appointmentListMiddleWare__type1 = async (req, res, next) => {
//   if (req.query.type === '1') {
//     console.log('1번')
//     let connection = await pool.getConnection(async(conn) => conn);
//     try {
//       let sql = 'SELECT * FROM calculate_list WHERE id = ?';
//       let [calculateList] = await connection.query(sql, req.session.userID);
  
//       async function test1(i) {
//         let members_Json = JSON.parse(calculateList[i].members);
//         let insertValArr = [members_Json, members_Json];
//         sql = `SELECT id, nickname, profile FROM users WHERE id IN ( ? ) UNION
//         SELECT id, nickname, profile FROM non_users WHERE id IN ( ? ) Limit 4` // 4명까지만
//         let [membersList] = await connection.query(sql, insertValArr);
//         connection.release();
  
//         console.log(JSON.membersList);
//         console.log(typeof(membersList));
//         calculateList[i].members = membersList;
  
//         return '완료';
//       }
    
//       async function test2() {
//         let count = 0;
//         return new Promise(async (resolve) => {
//           for (const x of calculateList) {
//             console.log('첫번째 작업', await test1(count));
//             count ++;
//           }
//           resolve('완료')
//         })
//       }
  
//       await test2();
      
//       res.send(calculateList);
//     } catch(err) {
//       console.log(err);
//     }
//   } else {
//     next();
//   }
// }


// const appointmentListMiddleWare__type1 = async (req, res, next) => {
//   console.log('what type:', req.query.type)
//   if (req.query.type === '1' || req.query.type === 'count') {
//     let connection = await pool.getConnection(async(conn) => conn);
//     try {
//       sql = `SELECT L.num, L.id, L.calculate_name, L.members, L.bookmark, L.date, L.time, L.state  
//       FROM calculate_list AS L 
//       JOIN calculate_list_members AS M
//       ON L.num = M.calculate_list_num WHERE M.member = ?`;
//       let [calculateListData] = await connection.query(sql, req.session.userID);

//       async function test1(i, num) {
//         let insertValArr = [num, num];
//         sql = `SELECT id, nickname, profile FROM users AS U
//         JOIN calculate_list_members AS M
//         ON U.id = M.member WHERE M.calculate_list_num = ?
//         UNION 
//         SELECT id, nickname, profile FROM non_users AS N
//         JOIN calculate_list_members AS M
//         ON N.id = M.member WHERE M.calculate_list_num = ?`;
//         let [membersList] = await connection.query(sql, insertValArr);
//         connection.release();
  
//         calculateListData[i].members = membersList;
  
//         return '완료';
//       }
    
//       async function test2() {
//         let count = 0;
//         return new Promise(async (resolve) => {
//           for (const x of calculateListData) {
//             console.log('첫번째 작업', await test1(count, x.num));
//             count ++;
//           }
//           resolve('완료')
//         })
//       }
  
//       await test2();

//       if (req.query.type === 'count') {
//         req.count1 = {count: calculateListData.length};
//         next();
//       } else {
//         res.send(calculateListData);
//       }

//     } catch(err) {
//       console.log(err);
//     }
//   } else {
//     next();
//   }
// }

const appointmentListMiddleWare__type1 = async (req, res, next) => {
  console.log('what type:', req.query.type)
  if (req.query.type === '1' || req.query.type === 'count') {
    let connection = await pool.getConnection(async(conn) => conn);
    try {
      
      /* 게시글 개수 구하기 위해서 */
      let sql = `SELECT count(*) as count
      FROM calculate_list AS L 
      JOIN calculate_list_members AS M
      ON L.num = M.calculate_list_num WHERE M.member = ?`;
      let insertValArr = [req.session.userID];
      let [totalListCount] = await connection.query(sql, insertValArr); 

      let total_contents = totalListCount[0].count; // 전체 게시글 개수
      let one_page_contents = 20; // 한 페이지당 게시글 개수

      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
      remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

      let current_page = req.query.current_page; 
      current_page === undefined ? current_page = 1 : current_page = parseInt(req.query.current_page); // 현재 페이지
      console.log('현재 페이지:',current_page)
      let start_value = (current_page-1) * one_page_contents; // 시작값
      let output_num; // 출력 개수
      console.log('시작값:', start_value)
    
      if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
        output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
      } else { // 현재 페이지가 마지막 페이지가 아니라면 
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }

      sql = `SELECT L.num, L.id, L.calculate_name, L.members, L.bookmark, L.date, L.time, L.state  
      FROM calculate_list AS L 
      JOIN calculate_list_members AS M
      ON L.num = M.calculate_list_num WHERE M.member = ?
      ORDER BY L.date DESC, L.time DESC limit ?, ?`;
      insertValArr = [req.session.userID, start_value, output_num];
      let [calculateListData] = await connection.query(sql, insertValArr);
  
      async function test1(i, num) {
        let insertValArr = [num, num];
        sql = `SELECT id, nickname, profile FROM users AS U
        JOIN calculate_list_members AS M
        ON U.id = M.member WHERE M.calculate_list_num = ?
        UNION 
        SELECT id, nickname, profile FROM non_users AS N
        JOIN calculate_list_members AS M
        ON N.id = M.member WHERE M.calculate_list_num = ?
        LIMIT 0,4`; // 0번째부터 4개 추출하기
        let [membersList] = await connection.query(sql, insertValArr);
        connection.release();

        console.log('memberList값:', membersList)

        calculateListData[i].members = membersList;
  
        return '완료';
      }
    
      async function test2() {
        let count = 0;
        return new Promise(async (resolve) => {
          for (const x of calculateListData) {
            console.log('첫번째 작업', await test1(count, x.num));
            count ++;
          }
          resolve('완료')
        })
      }
  
      await test2();

      if (req.query.type === 'count') {
        req.count1 = {count: totalListCount[0].count};
        next();
      } else {
        console.log('total_pages', total_pages)
        res.send({list: calculateListData,totalPageCount: total_pages});
      }

    } catch(err) {
      console.log(err);
    }
  } else {
    next();
  }
}

/* 정산중인 약속 */
const appointmentListMiddleWare__type2 = async (req, res, next) => {
  if (req.query.type === '2' || req.query.type === 'count') {
    let connection = await pool.getConnection(async(conn) => conn);
    try {

      /* 게시글 개수 구하기 위해서 */
      sql = `SELECT count(*) as count 
      FROM calculate_list AS L 
      JOIN calculate_list_members AS M
      ON L.num = M.calculate_list_num WHERE M.member = ? and state = ?`;
      let insertValArr = [req.session.userID, 'true'];
      let [totalListCount] = await connection.query(sql, insertValArr);

      let total_contents = totalListCount[0].count; // 전체 게시글 개수
      let one_page_contents = 20; // 한 페이지당 게시글 개수

      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
      remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가
    
      let current_page = req.query.current_page;
      current_page === undefined ? current_page = 1 : current_page = parseInt(req.query.current_page); // 현재 페이지
      console.log('현재 페이지:',current_page)
      let start_value = (current_page-1) * one_page_contents; // 시작값
      let output_num; // 출력 개수
      console.log('시작값:', start_value)
    
      if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
        output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
      } else { // 현재 페이지가 마지막 페이지가 아니라면 
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }

      sql = `SELECT L.num, L.id, L.calculate_name, L.members, L.bookmark, L.date, L.time, L.state  
      FROM calculate_list AS L 
      JOIN calculate_list_members AS M
      ON L.num = M.calculate_list_num WHERE M.member = ? and state = ?
      ORDER BY L.date DESC, L.time DESC limit ?, ?`;
      insertValArr = [req.session.userID, 'true', start_value, output_num];
      let [calculateListData] = await connection.query(sql, insertValArr);
  
      async function test1(i, num) {
        let insertValArr = [num, num];
        sql = `SELECT id, nickname, profile FROM users AS U
        JOIN calculate_list_members AS M
        ON U.id = M.member WHERE M.calculate_list_num = ?
        UNION 
        SELECT id, nickname, profile FROM non_users AS N
        JOIN calculate_list_members AS M
        ON N.id = M.member WHERE M.calculate_list_num = ?
        LIMIT 0,4`;

        let [membersList] = await connection.query(sql, insertValArr);
        connection.release();
  
        calculateListData[i].members = membersList;
  
        return '완료';
      }
    
      async function test2() {
        let count = 0;
        return new Promise(async (resolve) => {
          for (const x of calculateListData) {
            console.log('첫번째 작업', await test1(count, x.num));
            count ++;
          }
          resolve('완료')
        })
      }
  
      await test2();
      
      if (req.query.type === 'count') {
        console.log("2번쨏ount: ", totalListCount[0].count)
        req.count2 = {count: totalListCount[0].count};
        next();
      } else {
        res.send({list: calculateListData, totalPageCount: total_pages});
      }
    } catch(err) {
      console.log(err);
    }
  } else {
    next();
  }
}

/* 정산 완료된 약속 */
const appointmentListMiddleWare__type3 = async (req, res, next) => {
  if (req.query.type === '3' || req.query.type === 'count') {
    let connection = await pool.getConnection(async(conn) => conn);
    try {

      /* 게시글 개수 구하기 위해서 */
      sql = `SELECT count(*) as count
      FROM calculate_list AS L 
      JOIN calculate_list_members AS M
      ON L.num = M.calculate_list_num WHERE M.member = ? and state = ?`;
      let insertValArr = [req.session.userID, 'false'];
      let [totalListCount] = await connection.query(sql, insertValArr);

      let total_contents = totalListCount[0].count; // 전체 게시글 개수
      let one_page_contents = 20; // 한 페이지당 게시글 개수

      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
      remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가
    
      let current_page = req.query.current_page;
      current_page === undefined ? current_page = 1 : current_page = parseInt(req.query.current_page); // 현재 페이지
      console.log('현재 페이지:',current_page)
      let start_value = (current_page-1) * one_page_contents; // 시작값
      let output_num; // 출력 개수
      console.log('시작값:', start_value)
    
      if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
        output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
      } else { // 현재 페이지가 마지막 페이지가 아니라면 
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }

      sql = `SELECT L.num, L.id, L.calculate_name, L.members, L.bookmark, L.date, L.time, L.state  
      FROM calculate_list AS L 
      JOIN calculate_list_members AS M
      ON L.num = M.calculate_list_num WHERE M.member = ? and state = ?
      ORDER BY L.date DESC, L.time DESC limit ?, ?`;
      insertValArr = [req.session.userID, 'false', start_value, output_num];
      let [calculateListData] = await connection.query(sql, insertValArr);
  
      async function test1(i, num) {
        let insertValArr = [num, num];
        sql = `SELECT id, nickname, profile FROM users AS U
        JOIN calculate_list_members AS M
        ON U.id = M.member WHERE M.calculate_list_num = ?
        UNION 
        SELECT id, nickname, profile FROM non_users AS N
        JOIN calculate_list_members AS M
        ON N.id = M.member WHERE M.calculate_list_num = ?
        LIMIT 0,4`;

        let [membersList] = await connection.query(sql, insertValArr);
        connection.release();
  
        calculateListData[i].members = membersList;
  
        return '완료';
      }
    
      async function test2() {
        let count = 0;
        return new Promise(async (resolve) => {
          for (const x of calculateListData) {
            console.log('첫번째 작업', await test1(count, x.num));
            count ++;
          }
          resolve('완료')
        })
      }
  
      await test2();
      
      if (req.query.type === 'count') {
        req.count3 = {count: totalListCount[0].count};
        next();
      } else {
        res.send({list: calculateListData, totalPageCount: total_pages});
      }

    } catch(err) {
      console.log(err);
    }
  } else {
    next();
  }
}




// const appointmentListMiddleWare__type4 = async (req, res, next) => {
//   if (req.query.type === '4') {
//     console.log("4번입니다")
//     let connection = await pool.getConnection(async(conn) => conn);
//     try {
//       let sql = 'SELECT * FROM calculate_list WHERE id = ? and bookmark = ?';
//       let insertValArr = [req.session.userID, 'true'];
//       let [calculateList] = await connection.query(sql, insertValArr);
  
//       async function test1(i) {
//         let members_Json = JSON.parse(calculateList[i].members);
//         let insertValArr = [members_Json, members_Json];
//         sql = `SELECT id, nickname, profile FROM users WHERE id IN ( ? ) UNION
//         SELECT id, nickname, profile FROM non_users WHERE id IN ( ? ) Limit 4` // 4명까지만
//         let [membersList] = await connection.query(sql, insertValArr);
//         connection.release();
  
//         console.log(JSON.membersList);
//         console.log(typeof(membersList));
//         calculateList[i].members = membersList;
  
//         return '완료';
//       }
    
//       async function test2() {
//         let count = 0;
//         return new Promise(async (resolve) => {
//           for (const x of calculateList) {
//             console.log('첫번째 작업', await test1(count));
//             count ++;
//           }
//           resolve('완료')
//         })
//       }
  
//       await test2();
      
//       res.send(calculateList);
//     } catch(err) {
//       console.log(err);
//     }
//   } else {
//     next();
//   }
// }

const appointmentListMiddleWare__type4 = async (req, res, next) => {
  if (req.query.type === '4' || req.query.type === 'count') {
    let connection = await pool.getConnection(async(conn) => conn);
    try {

      /* 게시글 개수 구하기 위해서 */
      sql = `SELECT count(*) as count
      FROM calculate_list AS L 
      JOIN calculate_list_members AS M
      ON L.num = M.calculate_list_num WHERE M.member = ? and bookmark = ?`;
      let insertValArr = [req.session.userID, 'true'];
      let [totalListCount] = await connection.query(sql, insertValArr); 

      let total_contents = totalListCount[0].count; // 전체 게시글 개수
      let one_page_contents = 20; // 한 페이지당 게시글 개수

      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
      remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가
    
      let current_page = req.query.current_page;
      current_page === undefined ? current_page = 1 : current_page = parseInt(req.query.current_page); // 현재 페이지
      console.log('현재 페이지:',current_page)
      let start_value = (current_page-1) * one_page_contents; // 시작값
      let output_num; // 출력 개수
      console.log('시작값:', start_value)
    
      if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
        output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
      } else { // 현재 페이지가 마지막 페이지가 아니라면 
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }

      sql = `SELECT L.num, L.id, L.calculate_name, L.members, L.bookmark, L.date, L.time, L.state  
      FROM calculate_list AS L 
      JOIN calculate_list_members AS M
      ON L.num = M.calculate_list_num WHERE M.member = ? and bookmark = ?
      ORDER BY L.date DESC, L.time DESC limit ?, ?`;
      insertValArr = [req.session.userID, 'true', start_value, output_num];
      let [calculateListData] = await connection.query(sql, insertValArr);
  
      async function test1(i, num) {
        let insertValArr = [num, num];
        sql = `SELECT id, nickname, profile FROM users AS U
        JOIN calculate_list_members AS M
        ON U.id = M.member WHERE M.calculate_list_num = ?
        UNION 
        SELECT id, nickname, profile FROM non_users AS N
        JOIN calculate_list_members AS M
        ON N.id = M.member WHERE M.calculate_list_num = ?
        LIMIT 0,4`;

        let [membersList] = await connection.query(sql, insertValArr);
        connection.release();
  
        calculateListData[i].members = membersList;
  
        return '완료';
      }
    
      async function test2() {
        let count = 0;
        return new Promise(async (resolve) => {
          for (const x of calculateListData) {
            console.log('첫번째 작업', await test1(count, x.num));
            count ++;
          }
          resolve('완료')
        })
      }
  
      await test2();
      
      if (req.query.type === 'count') {
        req.count4 = {count: totalListCount[0].count};
        next();
      } else {
        res.send({list: calculateListData, totalPageCount: total_pages});
      }

    } catch(err) {
      console.log(err);
    }
  } else {
    next();
  }
}

const appointmentListMiddleWare__type_count = async (req, res, next) => {
  const countList = [req.count1, req.count2, req.count3, req.count4]
  console.log('타입별 count값:', countList);
  res.send({countList: countList});
}


/* 타입별 약속 리스트 출력 */
app.get('/appointmentList', 
appointmentListMiddleWare__type1, // 전체 약속
appointmentListMiddleWare__type2, // 정산중인 약속
appointmentListMiddleWare__type3, // 정산 완료된 약속
appointmentListMiddleWare__type4, // 즐겨찾기 약속
appointmentListMiddleWare__type_count // 타입 별 약속 개수 출력
)








app.put('/appointmentList/bookmark/:num', async function(req, res){ // 약속 즐겨찾기 변경
  let connection = await pool.getConnection(async(conn) => conn);

  const num = req.params.num;
  const bookmark = req.body.data.bookmark;

  let sql = 'UPDATE calculate_list SET bookmark = ? WHERE num = ?';
  let insertValArr = [bookmark, num];
  let [bookmark_state] = await connection.query(sql, insertValArr);
  
  res.send({status: 'success'});
})


/* 프로필 설정 */
app.post('/userinfo/profile', upload.single('uploadImage'), function(req, res){
  if (req.session) {
    let profileFile = 'http://localhost:6001/' + req.file.path;
    console.log(profileFile)
    console.log(req.session.userID)

    let insertValArr = [profileFile, req.session.userID];
    sql = "UPDATE users SET profile = ? WHERE id = ?"; 

    connection.query(sql, insertValArr, function(error, rows){ // db에 글 저장
      if (error) throw error;
      res.send({url: profileFile});
    });
  }
})



// 멤버들의 아이디 목록을 가져오는 미들웨어
// const memberListMiddleWare__ID = (req, res, next) => {
//   let calculate_list_num = req.query.num;

//   let sql = 'SELECT members FROM calculate_list WHERE num = ?';
//   connection.query(sql, calculate_list_num, function(error, rows){
//     if (error) throw error;
//     let members = JSON.parse(rows[0].members); // 멤버들의 아이디 리스트

//     console.log('멤버들의 아이디:',members)

//     let insertValArr = [members, members];
//     sql = `SELECT id, nickname, profile FROM users WHERE id IN ( ? ) UNION
//     SELECT id, nickname, profile FROM non_users WHERE id IN ( ? )`
  
//     connection.query(sql, insertValArr, function(error, rows){ 
//       if (error) throw error;
//       req.members = {membersID: members, memberList: rows};
//       next();
//     });
//   });
// }

// // 멤버들의 아이디 목록을 가져오는 미들웨어
// const memberListMiddleWare__ID = (req, res, next) => {
//   let calculate_list_num = req.query.num;

//   let sql = 'SELECT member FROM calculate_list_members WHERE calculate_list_num = ?';
//   connection.query(sql, calculate_list_num, function(error, rows){
//     if (error) throw error;
//     // let members = JSON.parse(rows[0].members); // 멤버들의 아이디 리스트
//     let members = []; // 멤버들의 아이디 리스트
//     for(x of rows) {
//       members.push(x.member)
//     }

//     let insertValArr = [members, members];
//     sql = `SELECT id, nickname, profile FROM users WHERE id IN ( ? ) UNION
//     SELECT id, nickname, profile FROM non_users WHERE id IN ( ? )`
  
//     connection.query(sql, insertValArr, function(error, rows){ 
//       if (error) throw error;
//       members = []; // 멤버들의 아이디 리스트
//       for (x of rows) {
//         members.push(x.id)
//       }
//       req.members = {membersID: members, memberList: rows};
//       next();
//     });
//   });
// }

// // 비용 총 합계, 1인당 내야 할 비용을 구하는 미들웨어
// const memberListMiddleWare__totalCost = (req, res, next) => {
//   let calculate_list_num = req.query.num;
//   let memberLen = req.members.membersID.length; // 멤버들의 수

//   let sql = "SELECT sum(cost) as sum FROM cost_list WHERE calculateListNum = ?";
  
//   connection.query(sql, calculate_list_num, function(error, rows){ // db에 글 저장
//     if (error) throw error;
//     let totalCostSum = rows[0].sum;
//     // let eachCost = (totalCostSum / rows.length).toFixed(2); // 소수점 둘째자리부터 반올림
//     let eachCost = Math.ceil(totalCostSum / memberLen) // 올림

//     totalCostSum === null? totalCostSum = 0 : totalCostSum = totalCostSum; 

//     req.cost = {sumCost: totalCostSum, eachCost: eachCost};
//     next();
//   });
// }

// // 각 멤버들의 비용 목록을 추가하는 미들웨어
// const memberListMiddleWare__costList = async (req, res, next) => {
//   let calculate_list_num = req.query.num;
//   let membersID = req.members.membersID; // 멤버들의 아이디 리스트
//   let memberList = req.members.memberList; // 멤버들의 정보 리스트
//   let eachCost = req.cost.eachCost; // 1인당 내야 하는 비용

//   let totalCost; // 총 지출비
//   let lackCost; // 더 내야하는 비용
//   let excessCost; // 받아야 하는 비용

//   const addEachMemberCost = async (i) => {
//     let connection = await pool.getConnection(async(conn) => conn);
//     try {
//       let insertValArr = [calculate_list_num, membersID[i]];
//       let sql = 'SELECT sum(cost) as sum FROM cost_list WHERE calculateListNum = ? and id = ?';
  
//       let [rows] = await connection.query(sql, insertValArr);
//       connection.release();

//       totalCost = Number(rows[0].sum); // 총 지출비
//       lackCost = totalCost - eachCost <= 0 ? eachCost - totalCost : 0; // 더 내야하는 비용
//       excessCost = totalCost - eachCost >= 0 ? totalCost - eachCost : 0; // 받아야 하는 비용
//       let cost_object = {totalCost: totalCost, lackCost: lackCost, excessCost: excessCost};

//       memberList[i] = Object.assign(memberList[i], cost_object);
      
//     } catch(err) {
//       console.log(err);
//     }
//   }

//   const addMemberCost = async () => {
//     let count = 0;
//     for (const x of membersID) {
//       await addEachMemberCost(count);
//       count ++;
//     }
//   }

//   await addMemberCost();

//   /* 아래 작업을 하는 이유: 로그인한 사람의 정보가 멤버리스트 중에서 제일 위로 올라오게 하기 위해서이다. */
//   if (memberList[0].id !== req.session.userID) { // 멤버리스트의 첫번째값이 본인 아이디가 아니라면
//     let ownArray = memberList.filter((x) => x.id === req.session.userID); // 내 유저 정보 객체값
//     let index = memberList.findIndex(x => x.id === req.session.userID); // 내 유저 정보 객체값이 들어있는 인덱스
//     let opponentArray = memberList[0]; // 바꿀 상대방의 유저 정보 객체값

//     memberList[0] = ownArray[0]; // 첫 번째 인덱스에는 내 정보 넣기
//     memberList[index] = opponentArray; // 내 정보와 바꾸기 위해 원래의 내 인덱스에는 상대방 정보 넣기
//   }


//   res.send({
//     sumCost: req.cost.sumCost,
//     eachCost: req.cost.eachCost,
//     memberList: memberList
//   });

// }



// /* 회원, 비회원 멤버 리스트 + 개인 별 비용 목록 */
// app.get('/memberList', 
// memberListMiddleWare__ID,
// memberListMiddleWare__totalCost,
// memberListMiddleWare__costList
// )



/* 정산 리스트 출력 */
// app.get('/costlist', async function(req, res){
//   let connection = await pool.getConnection(async(conn) => conn);
//   try {
//     let num = req.query.num;

//     let sql = "SELECT count(*) as count FROM cost_list WHERE calculateListNum = ?";
//     let insertValArr = [num];
//     let [totalListCount] = await connection.query(sql, insertValArr);

//     let total_contents = totalListCount[0].count; // 전체 게시글 개수
//     let one_page_contents = 25; // 한 페이지당 게시글 개수

//     let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
//     let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
//     remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가
  
//     let current_page = req.query.current_page;
//     current_page === undefined ? current_page = 1 : current_page = parseInt(req.query.current_page); // 현재 페이지
//     console.log('현재 페이지:',current_page)
//     let start_value = (current_page-1) * one_page_contents; // 시작값
//     let output_num; // 출력 개수
//     console.log('시작값:', start_value)
  
//     if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
//       output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
//     } else { // 현재 페이지가 마지막 페이지가 아니라면 
//       output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
//     }

//     console.log(total_pages, output_num)
//     sql = "SELECT * FROM cost_list WHERE calculateListNum = ? limit ?, ?";
//     insertValArr = [num, start_value, output_num];
//     let [costListData] = await connection.query(sql, insertValArr);
//     res.send({list: costListData, totalPageCount: total_pages});
//   } catch(err) {
//     console.log(err);
//   }
// })



/* 비용 총 합계, 1인당 내야 할 비용 */
// app.get('/sum', function(req, res){
//   if (req.session) {
//     let num = req.query.num;
//     let memberNum = req.query.memberNum;
//     console.log(num, memberNum);

//     let sql = "SELECT sum(cost) as sum FROM cost_list WHERE calculateListNum = ?";
    
//     connection.query(sql, num, function(error, rows){ // db에 글 저장
//       if (error) throw error;
//       let totalCostSum = rows[0].sum;
//       // let eachCost = (totalCostSum / rows.length).toFixed(2); // 소수점 둘째자리부터 반올림
//       let eachCost = Math.ceil(totalCostSum / memberNum) // 올림
//       console.log(totalCostSum, eachCost)
      
//       res.send({'sumCost': totalCostSum, 'eachCost':eachCost});
//     });

//   } else {
//     console.log("해당 세션이 없습니다.")
//   }
// })




// 리액트에서 이미지 적용하기 위해서 필요
app.use('/profile',express.static(__dirname + '/profile'));


app.listen(port, () => {
  console.log('서버 실행 중 ...');
})


