const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017/';
const handleReset = async (req, res) => {
  const username = req.body.username || null;
  const userid = req.body.userid || null;
  const resetnumber = parseInt(req.body.resetnumber) || 0;
  console.log('resetnumber :>> ', resetnumber);

  if (!username || !userid) {
    console.log('invalid username or userid');
    res.json('Please put the valid user name and user ID');
  }
  function validateId(userid, databaseID) {
    return userid === databaseID;
  }
  async function dataOperate() {
    let conn = null;
    try {
      conn = await MongoClient.connect(url);
      console.log(
        `successfully connected to the database with username: ${username}`
      );
      const test = conn.db('test').collection(username);
      // find
      let arr = await test.find().toArray();
      console.log(arr);
      const databaseID = arr[0].userid;
      if (!validateId(userid, databaseID)) {
        const erorObj = { message: 'userid can not match with username ' };
        throw erorObj;
      }
      const current = arr[0].int;
      console.log('currentInt :>> ', current);
      console.log('resetnumber :>> ', resetnumber);
      // update
      await test.updateMany({ int: current }, { $set: { int: resetnumber } });
      // find
      arr = await test.find().toArray();
      console.log(arr);
      const currentIn = arr[0].int;
      res.json(
        `Your have reset your integer from: ${current} to a new integer: ${currentIn}`
      );
    } catch (err) {
      const errorMsg =
        'failed to get integer in database with error: ' + err.message;
      console.log(errorMsg);
      res.json(errorMsg);
    } finally {
      if (conn != null) conn.close();
    }
  }
  dataOperate();
};

module.exports = handleReset;
