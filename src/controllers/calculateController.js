/**
 * 정산 관련 컨트롤러
 *
 */
const bcrypt = require('bcrypt');
const { getCalculate } = require("../models/calculate/getCalculate");
const {
  addCalculateInfo,
  getCalculateNum,
  addNonMembers,
  addCalculateComplete,
  addMembers,
  sendMessage,
} = require("../models/calculate/addCalculate");
const {
  modifyCalculateName,
  modfiyNonMembers,
  modifyNonMemberCompleteState,
  modifyMembers,
  sendMessage2,
  deleteMembers,
  deleteMembersComplete
} = require("../models/calculate/modifyCalculate");
const {
  deleteCalculate,
  deleteAllComplete,
  deleteAllBookmark,
  deleteAllCost,
  deleteAllMessage
} = require("../models/calculate/deleteCalculate");
const {
  getCalculateList_count_Type1,
  getCalculateList_Type1,
  getCalculateList_Members_Type1,
} = require("../models/calculate/getCalculateList_Type1");
const {
  getCalculateList_count_Type2,
  getCalculateList_Type2,
  getCalculateList_Members_Type2,
} = require("../models/calculate/getCalculateList_Type2");
const {
  getCalculateList_count_Type3,
  getCalculateList_Type3,
  getCalculateList_Members_Type3,
} = require("../models/calculate/getCalculateList_Type3");
const {
  getCalculateList_count_Type4,
  getCalculateList_Type4,
  getCalculateList_Members_Type4,
} = require("../models/calculate/getCalculateList_Type4");
const {
  getMemberList,
  getMemberInfoList,
} = require("../models/calculate/getMemberIdList");
const { getTotalCost } = require("../models/calculate/getTotalCost");
const { getEachMemberCost } = require("../models/calculate/getEachMemberCost");
const {
  getMyCalculateListCount,
  getMyCalculateList,
} = require("../models/calculate/getMyCalculateList");
const {
  addBookmark,
  deleteBookmark,
} = require("../models/calculate/changeBookmark");
const {
  getMyCompleteState,
  getCompleteCount,
} = require("../models/calculate/getCalculateComplete");
const {
  addMyCompleteState,
  deleteMyCompleteState,
} = require("../models/calculate/changeMyCompleteState");
const {
  changeCompleteState,
} = require("../models/calculate/changeCompleteState");

const ErrorHandling = require("../errors/clientError");
const ServerErrorHandling = require("../errors/serverError");

/**
 * 정산 정보를 가져오는 컨트롤러
 */
exports.getCalculateController = async (req, res) => {
  try {
    const num = req.params.num;
    const result = await getCalculate(num);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send(result[0]);
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 정산을 저장하는 컨트롤러
 */
exports.addCalculateController = async (req, res) => {
  try {
    let name = req.body.name;
    let date = req.body.date;
    let time = req.body.time;
    let members = req.body.members;
    let members_idList = [];
    let message_idList = [];

    const result = await addCalculateInfo([
      req.session.userID,
      name,
      date,
      time,
    ]);
    if (result.message) throw new ServerErrorHandling(result.message);

    const numData = await getCalculateNum([name, date, time]);
    if (numData.message) throw new ServerErrorHandling(numData.message);
    let num = numData[0].num;

    for (x of members) {
      message_idList.push([x.id, `'${name}' 정산에 초대되었습니다.`, num]); // 메시지를 위해 아이디만 추출
    }

    /* 비회원일 경우 */
    for (let i = 0; i < members.length; i++) {
      if (!members[i].id) {
        // userID가 없을 경우: 비회원
        let non_userID = bcrypt.hashSync(members[i].nickname, 10); // 해시값으로 만든 비회원 아이디
        members[i].id = non_userID;

        // 비회원인 멤버 추가
        const result = await addNonMembers([non_userID, members[i].nickname]);
        if (result.message) throw new ServerErrorHandling(result.message);

        // 비회원들은 미리 정산완료 처리
        const result2 = await addCalculateComplete([num, non_userID]);
        if (result2.message) throw new ServerErrorHandling(result2.message);
      }
    }

    members_idList.push([num, req.session.userID]); // 본인 아이디도 추가
    for (x of members) {
      members_idList.push([num, x.id]); // 아이디만 추출
    }

    // 회원인 멤버를 추가
    const result2 = await addMembers([members_idList]);
    if (result2.message) throw new ServerErrorHandling(result2.message);

    // 메시지 전송
    const result3 = await sendMessage([message_idList]);
    if (result3.message) throw new ServerErrorHandling(result3.message);

    res.send();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 정산을 수정하는 컨트롤러
 */
exports.modifyCalculateController = async (req, res) => {
  try {
    const num = req.params.num;
    const { name, addMemberList, deleteMemberList } = req.body;
    let members_idList = [];
    let message_idList = [];

    const result = await modifyCalculateName([name, num]);
    if (result.message) throw new ServerErrorHandling(result.message);

    for (x of addMemberList) {
      message_idList.push([x.id, `'${name}' 정산에 초대되었습니다.`, num]); // 메시지를 위해 아이디만 추출
    }

    if (addMemberList.length > 0) {
      /* 비회원일 경우 */
      for (let i = 0; i < addMemberList.length; i++) {
        if (!addMemberList[i].id) {
          // userID가 없을 경우: 비회원
          let non_userID = bcrypt.hashSync(addMemberList[i].nickname, 10); // 해시값으로 만든 비회원 아이디
          addMemberList[i].id = non_userID;

          // 비회원 멤버 추가
          const result = await modfiyNonMembers([non_userID, addMemberList[i].nickname]);
          if (result.message) throw new ServerErrorHandling(result.message);

          // 비회원들은 미리 정산완료 처리
          const result1 = await modifyNonMemberCompleteState([num, non_userID]);
          if (result1.message) throw new ServerErrorHandling(result1.message);
        }
      }

      for (x of addMemberList) {
        members_idList.push([num, x.id]); // 아이디만 추출
      }

      const result = await modifyMembers([members_idList]);
      if (result.message) throw new ServerErrorHandling(result.message);

      const result2 = await sendMessage2([message_idList]);
      if (result2.message) throw new ServerErrorHandling(result2.message);
    }
    if (deleteMemberList.length > 0) {
      const result = await deleteMembers([num, deleteMemberList]);
      if (result.message) throw new ServerErrorHandling(result.message);

      const result2 = await deleteMembersComplete([num, deleteMemberList]);
      if (result2.message) throw new ServerErrorHandling(result2.message);
    }

    res.send();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 정산을 삭제하는 컨트롤러
 */
exports.deleteCalculateController = async (req, res) => {
  try {
    const num = req.params.num;


    const result = await deleteCalculate(num);
    if (result.message) throw new ServerErrorHandling(result.message);

    const result2 = await deleteAllComplete(num);
    if (result2.message) throw new ServerErrorHandling(result2.message);

  
    const result3 = await deleteAllBookmark(num);
    if (result3.message) throw new ServerErrorHandling(result3.message);
  
    const result4 = await deleteAllCost(num);
    if (result4.message) throw new ServerErrorHandling(result4.message);
  
    const result5 = await deleteAllMessage(num);
    if (result5.message) throw new ServerErrorHandling(result5.message);

    res.send();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 전체 정산 리스트
 */
exports.calculateList__type1 = async (req, res, next) => {
  if (req.query.type === "1" || req.query.type === "count") {
    try {
      const totalListCount = await getCalculateList_count_Type1(
        req.session.userID
      );
      if (totalListCount.message) throw new ServerErrorHandling(result.message);

      let total_contents = totalListCount[0].count; // 전체 게시글 개수
      let one_page_contents = 20; // 한 페이지당 게시글 개수

      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수
      remain_contents ? (total_pages += 1) : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

      let current_page = req.query.current_page;
      current_page === undefined
        ? (current_page = 1)
        : (current_page = parseInt(req.query.current_page)); // 현재 페이지
      let start_value = (current_page - 1) * one_page_contents; // 시작값
      let output_num; // 출력 개수

      if (current_page == total_pages) {
        // 현재 페이지가 마지막 페이지라면
        remain_contents === 0
          ? (output_num = 20)
          : (output_num = remain_contents); // 출력 개수는 나머지 게시글의 개수
      } else {
        // 현재 페이지가 마지막 페이지가 아니라면
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }

      insertValArr = [
        req.session.userID,
        req.session.userID,
        start_value,
        output_num,
      ];
      let calculateListData = await getCalculateList_Type1(insertValArr);
      if (calculateListData.message)
        throw new ServerErrorHandling(calculateListData.message);

      async function getMember(i, num) {
        const membersList = await getCalculateList_Members_Type1([num, num]);
        if (membersList.message)
          throw new ServerErrorHandling(membersList.message);

        calculateListData[i].members = membersList;
        return "완료";
      }

      async function getMembers() {
        let index = 0;
        return new Promise(async (resolve) => {
          for (const calculate of calculateListData) {
            const result = await getMember(index, calculate.num);
            if (result.message) throw new ServerErrorHandling(result.message);
            index++;
          }
          resolve("완료");
        });
      }

      await getMembers();

      if (req.query.type === "count") {
        req.count1 = { count: totalListCount[0].count };
        next();
      } else {
        res.send({ list: calculateListData, totalPageCount: total_pages });
      }
    } catch (err) {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    }
  } else {
    next();
  }
};

/**
 * 정산중인 정산 리스트
 */
exports.calculateList__type2 = async (req, res, next) => {
  if (req.query.type === "2" || req.query.type === "count") {
    try {
      const totalListCount = await getCalculateList_count_Type2([
        req.session.userID,
        "true",
      ]);
      if (totalListCount.message)
        throw new ServerErrorHandling(totalListCount.message);

      let total_contents = totalListCount[0].count; // 전체 게시글 개수
      let one_page_contents = 20; // 한 페이지당 게시글 개수

      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수
      remain_contents ? (total_pages += 1) : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

      let current_page = req.query.current_page;
      current_page === undefined
        ? (current_page = 1)
        : (current_page = parseInt(req.query.current_page)); // 현재 페이지
      let start_value = (current_page - 1) * one_page_contents; // 시작값
      let output_num; // 출력 개수

      if (current_page == total_pages) {
        // 현재 페이지가 마지막 페이지라면
        remain_contents === 0
          ? (output_num = 20)
          : (output_num = remain_contents); // 출력 개수는 나머지 게시글의 개수
      } else {
        // 현재 페이지가 마지막 페이지가 아니라면
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }

      insertValArr = [
        req.session.userID,
        req.session.userID,
        "true",
        start_value,
        output_num,
      ];
      let calculateListData = await getCalculateList_Type2(insertValArr);
      if (calculateListData.message)
        throw new ServerErrorHandling(calculateListData.message);

      async function getMember(i, num) {
        const membersList = await getCalculateList_Members_Type2([num, num]);
        if (membersList.message)
          throw new ServerErrorHandling(membersList.message);

        calculateListData[i].members = membersList;
        return "완료";
      }

      async function getMembers() {
        let index = 0;
        return new Promise(async (resolve) => {
          for (const calculate of calculateListData) {
            const result = await getMember(index, calculate.num);
            if (result.message) throw new ServerErrorHandling(result.message);
            index++;
          }
          resolve("완료");
        });
      }

      await getMembers();

      if (req.query.type === "count") {
        req.count2 = { count: totalListCount[0].count };
        next();
      } else {
        res.send({ list: calculateListData, totalPageCount: total_pages });
      }
    } catch (err) {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    }
  } else {
    next();
  }
};

/**
 * 정산 완료된 정산 리스트
 */
exports.calculateList__type3 = async (req, res, next) => {
  if (req.query.type === "3" || req.query.type === "count") {
    try {
      const totalListCount = await getCalculateList_count_Type3([
        req.session.userID,
        "false",
      ]);
      if (totalListCount.message)
        throw new ServerErrorHandling(totalListCount.message);

      let total_contents = totalListCount[0].count; // 전체 게시글 개수
      let one_page_contents = 20; // 한 페이지당 게시글 개수

      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수
      remain_contents ? (total_pages += 1) : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

      let current_page = req.query.current_page;
      current_page === undefined
        ? (current_page = 1)
        : (current_page = parseInt(req.query.current_page)); // 현재 페이지
      let start_value = (current_page - 1) * one_page_contents; // 시작값
      let output_num; // 출력 개수

      if (current_page == total_pages) {
        // 현재 페이지가 마지막 페이지라면
        remain_contents === 0
          ? (output_num = 20)
          : (output_num = remain_contents); // 출력 개수는 나머지 게시글의 개수
      } else {
        // 현재 페이지가 마지막 페이지가 아니라면
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }

      insertValArr = [
        req.session.userID,
        req.session.userID,
        "false",
        start_value,
        output_num,
      ];
      let calculateListData = await getCalculateList_Type3(insertValArr);
      if (calculateListData.message)
        throw new ServerErrorHandling(calculateListData.message);

      async function getMember(i, num) {
        const membersList = await getCalculateList_Members_Type3([num, num]);
        if (membersList.message)
          throw new ServerErrorHandling(membersList.message);

        calculateListData[i].members = membersList;
        return "완료";
      }

      async function getMembers() {
        let index = 0;
        return new Promise(async (resolve) => {
          for (const calculate of calculateListData) {
            const result = await getMember(index, calculate.num);
            if (result.message) throw new ServerErrorHandling(result.message);
            index++;
          }
          resolve("완료");
        });
      }

      await getMembers();

      if (req.query.type === "count") {
        req.count3 = { count: totalListCount[0].count };
        next();
      } else {
        res.send({ list: calculateListData, totalPageCount: total_pages });
      }
    } catch (err) {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    }
  } else {
    next();
  }
};

/**
 * 즐겨찾기 정산 리스트
 */
exports.calculateList__type4 = async (req, res, next) => {
  if (req.query.type === "4" || req.query.type === "count") {
    try {
      const totalListCount = await getCalculateList_count_Type4([
        req.session.userID,
        req.session.userID,
        "true",
      ]);
      if (totalListCount.message)
        throw new ServerErrorHandling(totalListCount.message);

      let total_contents = totalListCount[0].count; // 전체 게시글 개수
      let one_page_contents = 20; // 한 페이지당 게시글 개수

      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수
      remain_contents ? (total_pages += 1) : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

      let current_page = req.query.current_page;
      current_page === undefined
        ? (current_page = 1)
        : (current_page = parseInt(req.query.current_page)); // 현재 페이지
      let start_value = (current_page - 1) * one_page_contents; // 시작값
      let output_num; // 출력 개수

      if (current_page == total_pages) {
        // 현재 페이지가 마지막 페이지라면
        remain_contents === 0
          ? (output_num = 20)
          : (output_num = remain_contents); // 출력 개수는 나머지 게시글의 개수
      } else {
        // 현재 페이지가 마지막 페이지가 아니라면
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }

      insertValArr = [
        req.session.userID,
        req.session.userID,
        "true",
        start_value,
        output_num,
      ];
      let calculateListData = await getCalculateList_Type4(insertValArr);
      if (calculateListData.message)
        throw new ServerErrorHandling(calculateListData.message);

      async function getMember(i, num) {
        const membersList = await getCalculateList_Members_Type4([num, num]);
        if (membersList.message)
          throw new ServerErrorHandling(membersList.message);

        calculateListData[i].members = membersList;
        return "완료";
      }

      async function getMembers() {
        let index = 0;
        return new Promise(async (resolve) => {
          for (const calculate of calculateListData) {
            const result = await getMember(index, calculate.num);
            if (result.message) throw new ServerErrorHandling(result.message);
            index++;
          }
          resolve("완료");
        });
      }

      await getMembers();

      if (req.query.type === "count") {
        req.count4 = { count: totalListCount[0].count };
        next();
      } else {
        res.send({ list: calculateListData, totalPageCount: total_pages });
      }
    } catch (err) {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    }
  } else {
    next();
  }
};

/**
 * 타입 별 정산 리스트 개수 출력
 */
exports.calculateList__type_count = async (req, res) => {
  try {
    const countList = [req.count1, req.count2, req.count3, req.count4];
    res.send({ countList: countList });
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 멤버들의 아이디와 리스트를 가져오는 컨트롤러
 */
exports.getMembersIDController = async (req, res, next) => {
  const calculate_list_num = req.query.num;
  try {
    let members = []; // 멤버들의 아이디 리스트

    await getMemberList([calculate_list_num], (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      for (x of result) {
        members.push(x.member);
      }
    });

    await getMemberInfoList([members, members], (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      members = []; // 멤버들의 아이디 리스트
      for (x of result) {
        members.push(x.id);
      }
      req.members = { membersID: members, memberList: result };
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 총 비용과 1인당 지출 비용을 계산하는 컨트롤러
 */
exports.getTotalCostController = async (req, res, next) => {
  const calculate_list_num = req.query.num;
  const memberLength = req.members.membersID.length; // 멤버들의 수
  let totalCostSum;
  try {
    await getTotalCost(calculate_list_num, (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      totalCostSum = result[0].sum;
    });

    let eachCost = Math.ceil(totalCostSum / memberLength); // 올림
    totalCostSum === null ? (totalCostSum = 0) : (totalCostSum = totalCostSum);
    req.cost = { sumCost: totalCostSum, eachCost: eachCost };
    next();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 각 멤버들에게 비용을 부여하는 컨트롤러
 */
exports.getMemberCostListController = async (req, res) => {
  const calculate_list_num = req.query.num;
  let membersID = req.members.membersID; // 멤버들의 아이디 리스트
  let memberList = req.members.memberList; // 멤버들의 정보 리스트
  const eachCost = req.cost.eachCost; // 1인당 내야 하는 비용

  let totalCost; // 총 지출비
  let lackCost; // 더 내야하는 비용
  let excessCost; // 받아야 하는 비용

  const addEachMemberCost = async (i) => {
    try {
      await getEachMemberCost(
        [calculate_list_num, membersID[i]],
        (result, err) => {
          if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
          totalCost = Number(result[0].sum); // 총 지출비
          lackCost = totalCost - eachCost <= 0 ? eachCost - totalCost : 0; // 더 내야하는 비용
          excessCost = totalCost - eachCost >= 0 ? totalCost - eachCost : 0; // 받아야 하는 비용
          let cost_object = {
            totalCost: totalCost,
            lackCost: lackCost,
            excessCost: excessCost,
          };
          memberList[i] = Object.assign(memberList[i], cost_object);
        }
      );
    } catch (err) {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    }
  };

  const addMemberCost = async () => {
    let count = 0;
    for (const x of membersID) {
      await addEachMemberCost(count);
      count++;
    }
  };

  await addMemberCost();

  /* 아래 작업을 하는 이유: 로그인한 사람의 정보가 멤버리스트 중에서 제일 위로 올라오게 하기 위해서이다. */
  if (memberList[0].id !== req.session.userID) {
    // 멤버리스트의 첫번째값이 본인 아이디가 아니라면
    let ownArray = memberList.filter((x) => x.id === req.session.userID); // 내 유저 정보 객체값
    let index = memberList.findIndex((x) => x.id === req.session.userID); // 내 유저 정보 객체값이 들어있는 인덱스
    let opponentArray = memberList[0]; // 바꿀 상대방의 유저 정보 객체값

    memberList[0] = ownArray[0]; // 첫 번째 인덱스에는 내 정보 넣기
    memberList[index] = opponentArray; // 내 정보와 바꾸기 위해 원래의 내 인덱스에는 상대방 정보 넣기
  }

  res.send({
    sumCost: req.cost.sumCost,
    eachCost: req.cost.eachCost,
    memberList: memberList,
  });
};

/**
 * 내가 작성한 정산 리스트를 가져오는 컨트롤러
 */
exports.getMyCalculateListController = async (req, res) => {
  try {
    const count = await getMyCalculateListCount(
      req.session.userID,
      (result, err) => {
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        totalCostSum = result[0].sum;
      }
    );

    let total_contents = count[0].count; // 전체 게시글 개수
    let one_page_contents = 10; // 한 페이지당 게시글 개수

    let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
    let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수
    remain_contents ? (total_pages += 1) : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

    let current_page = Number(req.params.current_page);
    current_page === undefined
      ? (current_page = 1)
      : (current_page = parseInt(current_page)); // 현재 페이지
    let start_value = (current_page - 1) * one_page_contents; // 시작값
    let output_num; // 출력 개수

    if (
      current_page == total_pages &&
      total_pages !== 1 &&
      remain_contents !== 0
    ) {
      // 현재 페이지가 마지막 페이지라면
      output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
    } else {
      // 현재 페이지가 마지막 페이지가 아니라면
      output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
    }

    const list = await getMyCalculateList(
      [req.session.userID, start_value, output_num],
      (result, err) => {
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        totalCostSum = result[0].sum;
      }
    );

    res.send({ total_pages, list });
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 즐겨찾기 추가하는 컨트롤러
 */
exports.addBookmarkController = async (req, res) => {
  try {
    const num = req.params.num;
    const bookmark = await addBookmark([req.session.userID, num, "true"]);
    if (bookmark.message) throw new ServerErrorHandling(bookmark.message);
    res.send();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 즐겨찾기 삭제하는 컨트롤러
 */
exports.deleteBookmarkController = async (req, res) => {
  try {
    const num = req.params.num;
    const bookmark = await deleteBookmark([req.session.userID, num]);
    if (bookmark.message) throw new ServerErrorHandling(bookmark.message);
    res.send();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 정산 완료와 관련된 내용 가져오는 컨트롤러
 */
exports.getCalculateCompleteController = async (req, res) => {
  try {
    const num = req.params.num;
    let completeState; // 정산 완료 버튼 상태
    let completeCount; // 정산 완료 인원 수

    const state = await getMyCompleteState([num, req.session.userID]);
    if (state.message) throw new ServerErrorHandling(state.message);

    if (state.length) {
      // 내가 정산 완료 버튼을 눌렀을 경우: 값이 있음.
      completeState = true;
    } else {
      // 내가 정산 완료 버튼을 눌렀을 경우: 값이 없음.
      completeState = false;
    }

    const count = await getCompleteCount(num);
    if (count.message) throw new ServerErrorHandling(count.message);
    completeCount = count[0].count || 0;

    res.send({
      state: completeState,
      memberCount: completeCount,
      memberList: [],
    });
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 개인별 정산완료 동의 처리하는 컨트롤러
 */
exports.addCompleteController = async (req, res) => {
  try {
    const num = req.params.num;
    const state = await addMyCompleteState([num, req.session.userID]);
    if (state.message) throw new ServerErrorHandling(state.message);
    res.send();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 개인별 정산완료 비동의 처리하는 컨트롤러
 */
exports.deleteCompleteController = async (req, res) => {
  try {
    const num = req.params.num;
    const state = await deleteMyCompleteState([num, req.session.userID]);
    if (state.message) throw new ServerErrorHandling(state.message);
    res.send();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};

/**
 * 해당 정산을 정산 완료 또는 정산중으로 바꾸는 컨트롤러
 */
exports.changeCompleteController = async (req, res) => {
  try {
    const state = req.params.state;
    const num = req.params.num;
    const result = await changeCompleteState([state, num]);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send();
  } catch (err) {
    console.error(err);
    res.status(err.status).json({ message: err.message });
  }
};
