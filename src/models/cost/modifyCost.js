const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 지출 수정하는 작업
 */
exports.modifyCost = async (userID) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "UPDATE cost_list SET title=?,id=?,payer=?,cost=?,content=? WHERE num = ?";  
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