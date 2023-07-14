const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 비용 총 합계를 가져오는 작업
 */
exports.getTotalCost = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT sum(cost) as sum FROM cost_list WHERE calculateListNum = ?";   
    let [result] = await connection.query(sql, values);
    res(result, null);
  } catch (err) {
    connection.rollback();
    console.error(err);
    res(null, err);
  } finally {
    connection.release();
  }
};
