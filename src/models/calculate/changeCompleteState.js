const mysql = require('mysql2/promise');
const db = require('../../../config/db'); 

const pool = mysql.createPool(db);

/**
 * 해당 정산을 정산 완료 혹은 정산중으로 바꾸는 작업
 */
exports.changeCompleteState = async (values) => {
  let connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const sql = "UPDATE calculate_list SET state = ? WHERE num = ?";
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