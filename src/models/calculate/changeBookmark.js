const mysql = require("mysql2/promise");
const db = require("../../../config/db");

const pool = mysql.createPool(db);

/**
 * 즐겨찾기 추가하는 작업
 */
exports.addBookmark = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql =
      "INSERT INTO calculate_list_bookmark (userID, calculate_list_num, bookmark) VALUES (?, ?, ?)";
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

/**
 * 즐겨찾기 삭제하는 작업
 */
exports.deleteBookmark = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'DELETE FROM calculate_list_bookmark WHERE userID = ? AND calculate_list_num = ? ';
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
