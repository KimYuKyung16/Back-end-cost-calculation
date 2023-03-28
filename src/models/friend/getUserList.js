const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 전체 유저 리스트 가져오는 작업
 */
exports.getUserList = async (values, res) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = `SELECT u.id, u.nickname, u.profile, f.userID, f.friendID, w.sender, w.receiver FROM users AS u
    LEFT JOIN friendlist AS f ON u.id = f.friendID AND f.userID = ?
    LEFT JOIN friendwaitinglist AS w ON (u.id = w.receiver AND w.sender = ?) OR (u.id = w.sender AND w.receiver = ?)
    WHERE u.id NOT IN (?) AND u.id LIKE ?`;
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