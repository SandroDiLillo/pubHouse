// 

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
MongoClient.connect('mongodb+srv://root:root@cluster0sandro.nhkls.mongodb.net/Sandro1?retryWrites=true&w=majority'
)
.then(client => { 
  console.log('connected');
  _db = client.db()
  callback(client);
})
.catch(err => {
  console.log(err)
  throw err;
});
};

const getDb = () => {
  if(_db) {
    return _db;
  }
}

// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;