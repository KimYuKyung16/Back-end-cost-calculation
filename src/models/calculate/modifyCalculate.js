const mysql = require("mysql2/promise");
const db = require("../../../config/db");

const pool = mysql.createPool(db);

/**
 * 정산 이름을 변경하는 작업
 */
exports.modifyCalculateName = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "UPDATE calculate_list SET calculate_name = ? WHERE num = ?";
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
 * 비회원 멤버 추가하는 작업
 */
exports.modfiyNonMembers = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO non_users (id, nickname) VALUES (?, ?)";
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
 * 비회원인 멤버들은 정산완료 처리하는 작업
 */
exports.modifyNonMemberCompleteState = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql =
      "INSERT INTO calculate_complete (calculateListNum, userID) VALUES (?, ?)";
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
 * 회원인 멤버 추가하는 작업
 */
exports.modifyMembers = async (membersIdList) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql =
      "INSERT INTO calculate_list_members (calculate_list_num, member) VALUES ?";
    let [result] = await connection.query(sql, membersIdList);
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
 * 메시지 보내는 작업
 */
exports.sendMessage2 = async (messageIdList) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql =
      "INSERT INTO message (receiver, content, calculateListNum) VALUES ?";
    let [result] = await connection.query(sql, messageIdList);
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
 * 멤버들을 삭제하는 작업
 */
exports.deleteMembers = async (messageIdList) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql =
      "DELETE FROM calculate_list_members WHERE calculate_list_num = ? and member in (?)";
    let [result] = await connection.query(sql, messageIdList);
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
 * 멤버들의 정산완료를 삭제하는 작업
 */
exports.deleteMembersComplete = async (messageIdList) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql =
      "DELETE FROM calculate_complete WHERE calculateListNum = ? and userID in (?)";
    let [result] = await connection.query(sql, messageIdList);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return { message: "db에 에러가 있습니다." };
  } finally {
    connection.release();
  }
};
