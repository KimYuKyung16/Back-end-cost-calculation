const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 개인별 정산완료 추가하는 작업
 */
exports.addMyCompleteState = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO calculate_complete (calculateListNum, userID) VALUES (?, ?)";
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
 * 개인별 정산완료 취소하는 작업
 */
exports.deleteMyCompleteState = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "DELETE FROM calculate_complete WHERE calculateListNum = ? and userID = ?";
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