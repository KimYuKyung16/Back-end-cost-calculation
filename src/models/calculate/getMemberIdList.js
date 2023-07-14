const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 멤버들 리스트를 가져오는 작업
 */
exports.getMemberList = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'SELECT member FROM calculate_list_members WHERE calculate_list_num = ?';
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

/**
 * 멤버들의 정보가 담긴 리스트를 가져오는 작업
 */
 exports.getMemberInfoList = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = `SELECT id, nickname, profile FROM users WHERE id IN ( ? ) UNION
    SELECT id, nickname, profile FROM non_users WHERE id IN ( ? )`
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