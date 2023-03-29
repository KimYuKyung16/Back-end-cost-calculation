const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 정산 리스트 개수 가져오는 작업
 */
exports.getCostListCount = async (num, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT count(*) as count FROM cost_list WHERE calculateListNum = ?";
    let [totalListCount] = await connection.query(sql, num);
    res(totalListCount[0].count, null);
  } catch (err) {
    connection.rollback();
    console.error(err);
    res(null, err);
  } finally {
    connection.release();
  }
};

/**
 * 정산 리스트 가져오는 작업
 */
 exports.getCostList = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT * FROM cost_list WHERE calculateListNum = ? limit ?, ?";
    let [costList] = await connection.query(sql, values);
    res(costList, null);
  } catch (err) {
    connection.rollback();
    console.error(err);
    res(null, err);
  } finally {
    connection.release();
  }

};