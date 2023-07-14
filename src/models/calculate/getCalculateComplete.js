const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 내가 정산 완료 버튼을 눌렀는지 확인하는 작업
 */
exports.getMyCompleteState = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT * FROM calculate_complete WHERE calculateListNum = ? and userID = ?";
    let [result] = await connection.query(sql, values);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return ({message: "db에 에러가 있습니다."});
  } finally {
    connection.release();
  }
};

/**
 * 메시지 읽음 표시 변경하는 작업
 */
exports.getCompleteCount = async (num) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT count(*) as count FROM calculate_complete WHERE calculateListNum = ?";
    let [result] = await connection.query(sql, num);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return ({message: "db에 에러가 있습니다."});
  } finally {
    connection.release();
  }
};