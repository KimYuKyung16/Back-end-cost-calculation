const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 정산 정보를 가져오는 작업
 */
exports.getCalculate = async (num) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'SELECT id, calculate_name, date, time FROM calculate_list WHERE num = ?';
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