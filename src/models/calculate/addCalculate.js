const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 정산 정보를 가져오는 작업
 */
exports.addCalculateInfo = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO calculate_list (id, calculate_name, date, time) VALUES (?, ?, ?, ?)";
    let [result] = await connection.query(sql, values);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return ({message: "db에 에러가 있습니다."});
  } finally {
    connection.release();
  }
};

/**
 * 저장한 정산정보의 num값 가져오는 작업
 */
exports.getCalculateNum = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "SELECT num FROM calculate_list WHERE calculate_name = ? AND date = ? AND time = ?";
    let [result] = await connection.query(sql, values);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return ({message: "db에 에러가 있습니다."});
  } finally {
    connection.release();
  }
};

/**
 * 비회원인 멤버 추가하는 작업
 */
exports.addNonMembers = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO non_users (id, nickname) VALUES (?, ?)";
    let [result] = await connection.query(sql, values);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return ({message: "db에 에러가 있습니다."});
  } finally {
    connection.release();
  }
};

/**
 * 비회원인 멤버의 정산 완료 상태는 완료 처리하는 작업
 */
exports.addCalculateComplete = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO calculate_complete (calculateListNum, userID) VALUES (?, ?)";
    let [result] = await connection.query(sql, values);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return ({message: "db에 에러가 있습니다."});
  } finally {
    connection.release();
  }
};

/**
 * 회원인 멤버를 추가하는 작업
 */
exports.addMembers = async (membersIdList) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO calculate_list_members (calculate_list_num, member) VALUES ?";
    let [result] = await connection.query(sql, membersIdList);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return ({message: "db에 에러가 있습니다."});
  } finally {
    connection.release();
  }
};

/**
 * 초대받은 회원들에게 메시지를 보내는 작업
 */
exports.sendMessage = async (messageIdList) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "INSERT INTO message (receiver, content, calculateListNum) VALUES ?";
    let [result] = await connection.query(sql, messageIdList);
    return result;
  } catch (err) {
    connection.rollback();
    console.error(err);
    return ({message: "db에 에러가 있습니다."});
  } finally {
    connection.release();
  }
};