const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 전체 유저 리스트 가져오는 작업
 */
exports.addFriend = async (additionInfo, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'INSERT INTO friendwaitinglist (sender, receiver, state) VALUES (?, ?, ?)'; 
    let [result] = await connection.query(sql, additionInfo);
    res(result, null);
  } catch (err) {
    connection.rollback();
    console.error(err);
    res(null, err);
  } finally {
    connection.release();
  }

};