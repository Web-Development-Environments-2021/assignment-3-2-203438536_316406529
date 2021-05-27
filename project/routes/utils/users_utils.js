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

// async function getUserFavoriteGames(){
//   return await DButils.execQuery(`select * from dbo.userFavoriteGames`);
// }


exports.getAllUsers = getAllUsers;
exports.getUserDetails = getUserDetails;