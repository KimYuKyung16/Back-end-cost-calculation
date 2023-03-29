const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 전체 유저 리스트 가져오는 작업
 */
exports.addCost = async (costInfo, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO cost_list (calculateListNum, title, id, payer, cost, content) VALUES (?, ?, ?, ?, ?, ?)";
    let [result] = await connection.query(sql, costInfo);
    res(result, null);
  } catch (err) {
    connection.rollback();
    console.error(err);
    res(null, err);
  } finally {
    connection.release();
  }

};