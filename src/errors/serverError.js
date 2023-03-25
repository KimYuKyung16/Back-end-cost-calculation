module.exports = class DBErrorHandling extends Error {
  constructor (message) {
    super(message);
    this.status = 500;
  }
}