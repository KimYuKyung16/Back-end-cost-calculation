const mysql = require("mysql2/promise");
const db = require("../../../config/db");

const pool = mysql.createPool(db);

/**
 * 친구 리스트 출력하는 작업
 */
exports.friendList= async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = `SELECT id, nickname, profile FROM friendlist AS f 
    LEFT JOIN users AS u ON u.id = f.friendID AND f.userID = ?
    WHERE u.id NOT IN (?)`;
    let [result] = await connection.query(sql, values);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return { message: "db에 에러가 있습니다." };
  } finally {
    connection.release();
  }
};
