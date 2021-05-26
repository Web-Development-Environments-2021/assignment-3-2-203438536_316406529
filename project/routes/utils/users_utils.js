const DButils = require("./DButils");



async function getAllUsers() {
  const users = await DButils.execQuery(
    'select * from dbo.Users'
  );
  return users;
}

async function getUserDetails(username) {
  const user = await DButils.execQuery(
    `select * from dbo.Users WHERE username='${username}'`
  );
  return user;
}


exports.getAllUsers = getAllUsers;
exports.getUserDetails = getUserDetails;