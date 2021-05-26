const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const teams_utils = require("./teams_utils");
const DButils = require("./DButils");



async function getFavoritePlayers_ids(username) {
    const player_ids = await DButils.execQuery(
      `select palyerID from useFavoriteplayers where username='${username}'`
    );
    return player_ids;
  }

async function markPlayerAsFavorite(username, palyerID) {
    await DButils.execQuery(
      `insert into useFavoriteplayers values ('${username}',${palyerID})`
    );
  }

async function getFavoritesUserTeams_ids(username) {//return list of teams ids that are in db favorite of the user
    const favorites_Teams_ids = await DButils.execQuery(
        `select teamID from useFavoriteteams where username='${username}'`
      );
      return favorites_Teams_ids;
  }


async function getFavoritesUserTeams(username){
    let teams_ids_list = await getFavoritesUserTeams_ids(username);
    let teams_info = await teams_utils.getTeamsInfo(teams_ids_list);
    return teams_utils.extractTeamDetails(teams_info);

}
exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers_ids = getFavoritePlayers_ids;
exports.getFavoritesUserTeams = getFavoritesUserTeams;