module.exports = class ErrorHandling extends Error {
  constructor (message) {
    super(message);
    this.status = 406;
  }
}

