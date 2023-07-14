const mysql = require("mysql2/promise");
const db = require("../../../config/db");

const pool = mysql.createPool(db);

/**
 * 게시글 개수 구하는 작업
 */
exports.getCalculateList_count_Type4 = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = `SELECT count(*) as count
    FROM calculate_list AS L
    LEFT JOIN calculate_list_bookmark AS B 
    ON L.num = B.calculate_list_num and B.userID = ?
    JOIN calculate_list_members AS M
    ON L.num = M.calculate_list_num WHERE M.member = ? and B.bookmark = ?`;
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
 * 게시글 리스트 구하는 작업
 */
exports.getCalculateList_Type4 = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = `SELECT L.num, L.id, L.calculate_name, L.members, L.date, L.time, L.state, B.userID, B.bookmark  
    FROM calculate_list AS L
    LEFT JOIN calculate_list_bookmark AS B 
    ON L.num = B.calculate_list_num and B.userID = ?
    JOIN calculate_list_members AS M
    ON L.num = M.calculate_list_num WHERE M.member = ? and B.bookmark = ? 
    ORDER BY L.date DESC, L.time DESC limit ?, ?`;

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
 * 게시글 리스트 멤버들 구하는 작업
 */
exports.getCalculateList_Members_Type4 = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = `SELECT id, nickname, profile FROM users AS U
    JOIN calculate_list_members AS M
    ON U.id = M.member WHERE M.calculate_list_num = ?
    UNION 
    SELECT id, nickname, profile FROM non_users AS N
    JOIN calculate_list_members AS M
    ON N.id = M.member WHERE M.calculate_list_num = ?`;

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
