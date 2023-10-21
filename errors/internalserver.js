class InternalServer extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServer';
    this.statusCode = 500;
  }
}

module.exports = InternalServer;
