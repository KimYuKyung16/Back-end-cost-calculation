const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 *  비용 삭제하는 작업
 */
exports.deleteCost = async (costNum, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "DELETE FROM cost_list WHERE num = ?"; 
    let [result] = await connection.query(sql, costNum);
    res(result, null);
  } catch (err) {
    connection.rollback();
    console.error(err);
    res(null, err);
  } finally {
    connection.release();
  }
};