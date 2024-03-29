const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 비용 추가하는 작업
 */
exports.addCost = async (costInfo, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO cost_list (calculateListNum, title, id, payer, cost, content, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
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