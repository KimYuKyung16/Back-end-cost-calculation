module.exports = class SessionErrorHandling extends Error {
  constructor (message) {
    super(message);
    this.status = 600;
  }
}