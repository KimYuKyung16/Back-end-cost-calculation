/**
 * 정산 관련 컨트롤러
 * 
 */

 const { getMemberList, getMemberInfoList } = require("../models/appointment/getMemberIdList");
 const { getTotalCost } = require("../models/appointment/getTotalCost");
 const { getEachMemberCost } = require("../models/appointment/getEachMemberCost");
 
 
 
 const ErrorHandling = require("../errors/clientError");
 const ServerErrorHandling = require("../errors/serverError");
 
 
/**
* 멤버들의 아이디와 리스트를 가져오는 컨트롤러
*/
exports.getMembersIDController = async (req, res, next) => { 
  const calculate_list_num = req.query.num;
  try {
    let members = []; // 멤버들의 아이디 리스트

    await getMemberList([calculate_list_num], (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      for(x of result) { members.push(x.member); }  
    });  

    await getMemberInfoList([members, members], (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      members = []; // 멤버들의 아이디 리스트
      for(x of result) { members.push(x.id); }
      req.members = { membersID: members, memberList: result };
      next();
    });  

  } catch (err) {
    console.error(err);
    res.status(err.stauts).json({message: err.message});
  }
}


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

    let eachCost = Math.ceil(totalCostSum / memberLength) // 올림
    totalCostSum === null? totalCostSum = 0 : totalCostSum = totalCostSum; 
    req.cost = {sumCost: totalCostSum, eachCost: eachCost};
    next();
  } catch (err) {
    console.error(err);
    res.status(err.stauts).json({message: err.message});
  }
  
}

  

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
      await getEachMemberCost([calculate_list_num, membersID[i]], (result, err) => {
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        totalCost = Number(result[0].sum); // 총 지출비
        lackCost = totalCost - eachCost <= 0 ? eachCost - totalCost : 0; // 더 내야하는 비용
        excessCost = totalCost - eachCost >= 0 ? totalCost - eachCost : 0; // 받아야 하는 비용
        let cost_object = {totalCost: totalCost, lackCost: lackCost, excessCost: excessCost};
        memberList[i] = Object.assign(memberList[i], cost_object);
      });  
    } catch (err) {
      console.error(err);
      res.status(err.stauts).json({message: err.message});
    }
  }

  const addMemberCost = async () => {
    let count = 0;
    for (const x of membersID) {
      await addEachMemberCost(count);
      count ++;
    }
  }

  await addMemberCost();

  /* 아래 작업을 하는 이유: 로그인한 사람의 정보가 멤버리스트 중에서 제일 위로 올라오게 하기 위해서이다. */
  if (memberList[0].id !== req.session.userID) { // 멤버리스트의 첫번째값이 본인 아이디가 아니라면
    let ownArray = memberList.filter((x) => x.id === req.session.userID); // 내 유저 정보 객체값
    let index = memberList.findIndex(x => x.id === req.session.userID); // 내 유저 정보 객체값이 들어있는 인덱스
    let opponentArray = memberList[0]; // 바꿀 상대방의 유저 정보 객체값

    memberList[0] = ownArray[0]; // 첫 번째 인덱스에는 내 정보 넣기
    memberList[index] = opponentArray; // 내 정보와 바꾸기 위해 원래의 내 인덱스에는 상대방 정보 넣기
  }
  
  res.send({
    sumCost: req.cost.sumCost,
    eachCost: req.cost.eachCost,
    memberList: memberList
  });
}

