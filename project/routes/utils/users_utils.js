const DButils = require("./DButils");



async function getAllUsers() {
  const users = await DButils.execQuery(
    'select * from dbo.Users'
  );
  return users;
}

exports.getAllUsers = getAllUsers;
