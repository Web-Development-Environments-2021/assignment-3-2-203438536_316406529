const DButils = require("./DButils");



async function getAllUsers() {//only for league managment
  const users = await DButils.execQuery(
    'select * from dbo.Users'
  );
  return users;
}

async function getUserDetails(username) {//loged in user
  const user = await DButils.execQuery(
    `select * from dbo.Users WHERE username='${username}'`
  );
  return user;
}


exports.getAllUsers = getAllUsers;
exports.getUserDetails = getUserDetails;