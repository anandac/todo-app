const MongoClient = require("mongodb").MongoClient;
// const url = "mongodb://localhost:27017";
const url =
  "mongodb+srv://tiger:tiger@todo-eitol.mongodb.net/test?retryWrites=true&w=majority";
var _db;

module.exports = {
  connectDB: async function() {
    const client = await MongoClient.connect(url);
    _db = await client.db("todo");
    return _db;
  }
};
