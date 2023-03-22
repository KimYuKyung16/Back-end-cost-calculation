const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 유저 등록 작업
 */
exports.addUser = async (registerInfo, res) => {
  
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO users (nickname, id, pw) VALUES (?, ?, ?)";
    let [result] = await connection.query(sql, registerInfo);
    res(result, null);
  } catch (err) {
    connection.rollback();
    console.error(err);
  } finally {
    connection.release();
  }

};