const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 전체 정산 리스트 개수 가져오는 작업
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
 * 전체 정산 리스트 가져오는 작업
 */
 exports.getTotalCostList = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT * FROM cost_list WHERE calculateListNum = ? ORDER BY date ASC, time ASC limit ?, ? ";
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

/**
 * 필터링 된 정산 리스트 개수 가져오는 작업
 */
 exports.getFilteredCostListCount = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT count(*) as count FROM cost_list WHERE calculateListNum = ? and id = ?";
    let [totalListCount] = await connection.query(sql, values);
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
 * 필터링 된 정산 리스트 가져오는 작업
 */
 exports.getFilteredCostList = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT * FROM cost_list WHERE calculateListNum = ? and id = ? ORDER BY date ASC, time ASC limit ?, ?";
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