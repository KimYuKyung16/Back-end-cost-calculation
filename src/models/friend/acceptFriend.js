const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 친구 신청 수락하는 작업 & 친구 신청 대기 리스트에서 제거하는 작업
 */
exports.acceptFriend = async (insertvalue, deleteValue, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    for (i=0; i<2; i++) {
      const sql = 'INSERT INTO friendlist (userID, friendID) VALUES (?, ?)'; 
      let [result] = await connection.query(sql, insertvalue[i]);
    }

    const sql = 'DELETE FROM friendwaitinglist WHERE sender = ? AND receiver = ?';
    let [result] = await connection.query(sql, deleteValue);
    res(result, null);
  } catch (err) {
    connection.rollback();
    console.error(err);
    res(null, err);
  } finally {
    connection.release();
  }

};