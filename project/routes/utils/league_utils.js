const axios = require("axios");
const e = require("express");
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const STAGE_ID = 77447500;
const favorites_utils = require("./favorites_utils");
const { getGameDetaildByID } = require("./games_utils");

async function getLeagueData() {//return league data with games, league_name, current_season_name, current_stage_name, nextComingGame
  const league = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`, {
    params: {
      include: "season",
      api_token: process.env.api_token,
    },
  });
  let stage;

  stage = await axios.get(`${api_domain}/stages/${STAGE_ID}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  let stage_name = stage.data.data.name;

  let currentDate = new Date().toISOString();
  //need to fix this query
  const nextGame =
    await DButils.execQuery(`select top 1 game_id, home_team_id, away_team_id, game_date, game_hour, home_team, away_team, field \
  from dbo.games WHERE game_date >= '${currentDate}'  ORDER BY game_date ASC, game_hour ASC`);
  let nextGameInfo;
  if (nextGame[0]) {
    const { game_hour, game_date, home_team, away_team, field,game_id, home_team_id, away_team_id } = nextGame[0];

    let game_hour_split = String(game_hour).slice(16, 25);
    let game_date_split = String(game_date).slice(0, 15);
    nextGameInfo = {
      game_date: game_date_split,
      game_hour: game_hour_split,
      home_team: home_team,
      away_team: away_team,
      field: field,
      game_id: game_id,
      home_team_id: home_team_id,
      away_team_id: away_team_id,
    };
  } else {
    nextGameInfo = "Not Exist";
  }
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage_name,
    nextComingGame: nextGameInfo,
  };
}

async function getCurrentStageGames() {//get games from DB by stage
  const currentDate = new Date().toISOString();
  const futureStagegamesID = await DButils.execQuery(
    `select game_id from dbo.games WHERE game_date >= '${currentDate}'  ORDER BY game_date ASC`
  );
  let futureStageGamesList = [];
  futureStagegamesID.map((gameID) => {
    futureStageGamesList.push(getGameDetaildByID(gameID.game_id));
  });
  let futurePromises = await Promise.all(futureStageGamesList);
  const pastStageGamesID = await DButils.execQuery(
    `select game_id from dbo.games WHERE game_date < '${currentDate}'  ORDER BY game_date ASC`
  );
  let pastStageGamesList = [];
  pastStageGamesID.map((gameID) => {
    pastStageGamesList.push(getGameDetaildByID(gameID.game_id));
  });
  let pastPromises = await Promise.all(pastStageGamesList);
  return {
    pastGamesList: pastPromises,
    futureGamesList: futurePromises,
  };
}

async function getSeachData() {// return data for search function
  const teamsData = await axios.get(`${api_domain}/teams/season/17328`, {
    params: {
      include: "squad.player.position",
      api_token: process.env.api_token,
    },
  });
  let playersPositions = new Set();
  let teamsNames = [];
  let playersNames = [];
  teamsData.data.data.map((team) => {
    teamsNames.push(team.name);
    playersNames = playersNames.concat(
      team.squad.data.map((curPlayer) => {
        playersPositions.add(curPlayer.player.data.position.data.name);
        return curPlayer.player.data.display_name;
      })
    );
  });
  let ppp = Array.from(playersPositions);
  return { teamsNames: teamsNames, playersNames: playersNames, positions: ppp };
}

exports.getLeagueData = getLeagueData;
exports.getCurrentStageGames = getCurrentStageGames;
exports.getSeachData = getSeachData;
