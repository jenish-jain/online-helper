module.exports = {
  ip: 'localhost',
  // TODO: read about these and tune these params
  mongoClientParams: {
    connetionTimeoutMS: 30000,
    socketTimeoutMs: 30000,
    useNewUrlParser: true,
  },
  mongo: {
    uri:
      'mongodb+srv://jenish:Juju6397@cluster0-ddjap.mongodb.net/ota-engine?retryWrites=true&w=majority',
  },
  versioning_engine: {
    url: '',
    timeout: 3000,
  },
  spreadSheetKeys: {
    flipkartReturn: '1XXx2hyEW0x80qEEGe4Ot8X01-z7Ae5xw4pFCkjlQBqI',
  },
};
