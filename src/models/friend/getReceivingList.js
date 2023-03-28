const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 전체 유저 리스트 가져오는 작업
 */
exports.getReceivingList = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = `SELECT U.id, U.nickname, U.profile, W.sender, W.receiver FROM friendwaitinglist AS W
    INNER JOIN users AS U
    ON U.id = W.sender WHERE receiver = ?`
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