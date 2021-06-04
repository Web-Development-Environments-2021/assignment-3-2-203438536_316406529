const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const teams_utils = require("./teams_utils");
const players_utils = require("./players_utils");

const games_utils = require("./games_utils");

const DButils = require("./DButils");



async function getFavoritePlayers_ids(username) {
    let player_ids = await DButils.execQuery(
      `select playerID from userFavoritePlayers where username='${username}'`
    );
    player_ids = player_ids.map((player) => {
      return player.playerID
    });
      
    return player_ids;
  }

async function markPlayerAsFavorite(username, playerID) {
    await DButils.execQuery(
      `insert into userFavoritePlayers values ('${username}',${playerID})`
    );
  }

async function getFavoritePlayers(username){
    let players_ids_list = await getFavoritePlayers_ids(username);
    let players_info = await players_utils.getPlayersInfo(players_ids_list);
    return players_utils.extractRelevantPlayerData(players_info);

}

async function getFavoritesUserTeams_ids(username) {//return list of teams ids that are in db favorite of the user
    const favorites_Teams_ids = await DButils.execQuery(
        `select teamID from userFavoriteTeams where username='${username}'`
      );
      return Array.from(favorites_Teams_ids);
  }

async function getFavoritesUserTeams(username){
    let teams_ids_list = await getFavoritesUserTeams_ids(username);
    let teams_info = await teams_utils.getTeamsInfo(teams_ids_list);
    return teams_utils.extractTeamDetails(teams_info);

}

async function markTeamAsFavorite(username, teamID){//add (username,team_id) to db
  await DButils.execQuery(
    `insert into userFavoriteTeams values ('${username}',${teamID})`
  );
}

async function getFavoritesUserGames(username){
  let games_ids_list = await getFavoritesUserGames_ids(username);
  let teams_info = await games_utils.getGamesInfo(games_ids_list);
  return teams_utils.extractGamesDetails(teams_info);

}

async function markGameAsFavorite(username, GameID){//add (username,GameID) to db
await DButils.execQuery(
  `insert into userFavoriteGames values ('${username}',${GameID})`
);
}

async function getFavoritesUserGames_ids(username) {//return list of games ids that are in db favorite of the user
  const favorites_Games_ids = await DButils.execQuery(
      `select gameID from userFavoriteGames where username='${username}'`
    );
    return Array.from(favorites_Games_ids);
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers_ids = getFavoritePlayers_ids;
exports.getFavoritesUserTeams = getFavoritesUserTeams;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.getFavoritesUserGames = getFavoritesUserGames;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;