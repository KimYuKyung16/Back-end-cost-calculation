const mysql = require("mysql2/promise");
const db = require("../../../config/db");

const pool = mysql.createPool(db);

/**
 * 정산 삭제하는 작업
 */
exports.deleteCalculate = async (num) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'DELETE FROM calculate_list WHERE num = ?';
    let [result] = await connection.query(sql, num);
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
 * 개인별 정산 완료 상태 삭제하는 작업
 */
exports.deleteAllComplete = async (num) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'DELETE FROM calculate_complete WHERE calculateListNum = ?';
    let [result] = await connection.query(sql, num);
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
exports.deleteAllBookmark = async (num) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'DELETE FROM calculate_list_bookmark WHERE calculate_list_num = ?';
    let [result] = await connection.query(sql, num);
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
 * 모든 지출 삭제하는 작업
 */
exports.deleteAllCost = async (num) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'DELETE FROM cost_list WHERE calculateListNum = ?';
    let [result] = await connection.query(sql, num);
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
 * 모든 메세지 삭제하는 작업
 */
exports.deleteAllMessage = async (num) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = 'DELETE FROM message WHERE calculateListNum = ?';
    let [result] = await connection.query(sql, num);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return { message: "db에 에러가 있습니다." };
  } finally {
    connection.release();
  }
};

