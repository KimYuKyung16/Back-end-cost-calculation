const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 내가 작성한 일정 전체 개수 가져오는 작업
 */
exports.getMyCalculateListCount = async (userID) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT count(*) as count FROM calculate_list WHERE id = ?";
    let [result] = await connection.query(sql, userID);
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
 * 일정 개수의 내가 작성한 일정 가져오는 작업
 */
exports.getMyCalculateList = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT *  FROM calculate_list WHERE id = ? ORDER BY date DESC limit ?, ?";
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