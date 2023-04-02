const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 각 멤벼별 비용 합계 구하는 작업 
 */
exports.getEachMemberCost = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'SELECT sum(cost) as sum FROM cost_list WHERE calculateListNum = ? and id = ?';
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