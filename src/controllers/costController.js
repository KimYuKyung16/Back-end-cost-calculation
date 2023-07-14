/**
 * 정산 관련 컨트롤러
 * 
 */

const { getCostListCount ,getTotalCostList, getFilteredCostListCount, getFilteredCostList } = require("../models/cost/getCostList");
const { addCost } = require("../models/cost/addCost");
const { modifyCost } = require("../models/cost/modifyCost");
const { deleteCost } = require("../models/cost/deleteCost");

const ErrorHandling = require("../errors/clientError");
const ServerErrorHandling = require("../errors/serverError");
 
/**
* 지출 리스트 출력 컨트롤러
*/
exports.getCostListController = async (req, res) => { 
  const num = req.query.num; 
  const filter = req.query.filter; // 필터링 기준이 되는 아이디

  if (filter.length >= 1) { // 필터링이 된 경우
    try {
      let total_contents; // 필터링 된 게시글 개수
  
      /* 필터링 된 정산리스트의 개수 구하기 */
      await getFilteredCostListCount([num, filter], (result, err) => { 
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        total_contents = result; 
      });  
  
      let one_page_contents = 25; // 한 페이지당 게시글 개수
      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
      remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가
    
      let current_page = req.query.current_page;
      current_page === undefined ? current_page = 1 : current_page = parseInt(req.query.current_page); // 현재 페이지
      
      let start_value = (current_page-1) * one_page_contents; // 시작값
      let output_num; // 출력 개수
    
      if (current_page == total_pages && total_pages !== 1) { // 현재 페이지가 마지막 페이지라면
        output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
      } else { // 현재 페이지가 마지막 페이지가 아니라면 
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }
  
      /* 필터링 된 정산리스트 가져오기 */
      await getFilteredCostList([num, filter, start_value, output_num], (result, err) => {
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        res.send({list: result, totalPageCount: total_pages});
      }); 
  
    } catch (err) {
      console.error(err);
      res.status(err.status).json({message: err.message});
    }
  } else { // 필터링이 안 된 경우: 전체
    try {
      let total_contents; // 전체 게시글 개수
  
      /* 전체 정산리스트의 개수 구하기 */
      await getCostListCount([num], (result, err) => { 
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        total_contents = result; 
      });  
  
      let one_page_contents = 25; // 한 페이지당 게시글 개수
      let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
      let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 
      remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가
    
      let current_page = req.query.current_page;
      current_page === undefined ? current_page = 1 : current_page = parseInt(req.query.current_page); // 현재 페이지
      
      let start_value = (current_page-1) * one_page_contents; // 시작값
      let output_num; // 출력 개수
    
      if (current_page == total_pages && total_pages !== 1) { // 현재 페이지가 마지막 페이지라면
        output_num = remain_contents; // 출력 개수는 나머지 게시글의 개수
      } else { // 현재 페이지가 마지막 페이지가 아니라면 
        output_num = one_page_contents; // 출력 개수는 한 페이지당 게시글의 개수
      }
  
      /* 전체 정산리스트 가져오기 */
      await getTotalCostList([num, start_value, output_num], (result, err) => {
        if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
        res.send({list: result, totalPageCount: total_pages});
      }); 
  
    } catch (err) {
      console.error(err);
      res.status(err.status).json({message: err.message});
    }
  
  }
}

/**
 * 지출 추가 컨트롤러
 */
exports.addCostController = (req, res) => { 
  let calculateListNum = parseInt(req.body.calculateListNum);
  let title = req.body.title;
  let id = req.body.id;
  let payer = req.body.payer;
  let cost = parseInt(req.body.cost);
  let content = req.body.content;
  let date = req.body.date;
  let time = req.body.time;

  let costInfo = [calculateListNum, title, id, payer, cost, content, date, time]; // mysql에 넣을 값 : [일정 번호, 제목, 정산자 아이디, 정산자, 지출, 내용]

  try {
    addCost(costInfo, (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      res.send();
    });  
  } catch(err) {
    console.error(err);
    res.status(err.status).json({message: err.message});
  }
}

/**
 * 지출 수정 컨트롤러
 */
exports.modifyCostController = async (req, res) => { 
  try {
    const num = req.params.num;
    const title = req.body.title;
    const id = req.body.id;
    const payer = req.body.payer;
    const cost = Number(req.body.cost);
    const content = req.body.content;

    const result = await modifyCost([title, id, payer, cost, content, num]);
    if (result.message) throw new ServerErrorHandling(result.message);
    res.send();
  } catch(err) {
    console.error(err);
    res.status(err.status).json({message: err.message});
  } 
}

/**
 * 지출 삭제 컨트롤러
 */
exports.deleteCostController = (req, res) => { 
  const num = req.params.num;

  try {
    deleteCost(num, (result, err) => {
      if (err) throw new ServerErrorHandling("db에 오류가 있습니다.");
      res.send();
    });  
  } catch(err) {
    console.error(err);
    res.status(err.status).json({message: err.message});
  }
}