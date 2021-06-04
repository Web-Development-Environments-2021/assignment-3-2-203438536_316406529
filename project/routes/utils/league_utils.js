const axios = require("axios");
const e = require("express");
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const favorites_utils = require("./favorites_utils");

async function getLeagueData() {
  const league = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`, {
    params: {
      include: "season",
      api_token: process.env.api_token,
    },
  });
  let stage;
  if (league.data.data.current_stage_id) {
    stage = await axios.get(
      `${api_domain}/stages/${league.data.data.current_stage_id}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
    stage = stage.data.data.name;
  } else {
    stage = "Not Exist";
  }
  let currentDate = new Date().toISOString();
  //need to fix this query
  const nextGame =
    await DButils.execQuery(`select top 1 game_date, game_hour, home_team, away_team, field \
  from dbo.games WHERE game_date >= '${currentDate}'  ORDER BY game_date ASC, game_hour ASC`);
  let nextGameInfo;
  if (nextGame[0]) {
    const { game_hour, game_date, home_team, away_team, field } = nextGame[0];

    let game_hour_split = String(game_hour).slice(16, 25);
    let game_date_split = String(game_date).slice(0, 15);
    nextGameInfo = {
      game_date: game_date_split,
      game_hour: game_hour_split,
      home_team: home_team,
      away_team: away_team,
      field: field,
    };
  } else {
    nextGameInfo = "Not Exist";
  }
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage,
    // next game details should come from DB
    nextComingGame: nextGameInfo,
  };
}

async function getCurrentStageGames() {
  const currentDate = new Date().toISOString();
  const futureStagegames =
    await DButils.execQuery(`select game_date, game_hour, home_team, away_team, field \
  from dbo.games WHERE game_date >= '${currentDate}'  ORDER BY game_date ASC`);
  const pastStageGames =
    await DButils.execQuery(`select game_date, game_hour, home_team, away_team, field \
  from dbo.games WHERE game_date < '${currentDate}'  ORDER BY game_date ASC`);
  return {
    pastGamesList: pastStageGames,
    futureGamesList: futureStagegames,
  };
}

async function getAllLeagueGames(username) {
  //return favorites_utils.getFavoritesUserGames(username);
}

async function getSeachData(){
  // teamsData = await axios.get(`https://soccer.sportmonks.com/api/v2.0/teams/season/17328?include=squad.player`);

  const teamsData = await axios.get(`${api_domain}/teams/season/17328`, {
    params: {
      include: "squad.player.position",
      api_token: process.env.api_token,
    },
  });
  let playersPositions = new Set();
  let teamsNames = [];
  let playersNames = [];
  teamsData.data.data.map((team) =>{
    teamsNames.push(team.name);
    playersNames = playersNames.concat(team.squad.data.map((curPlayer) => {
      playersPositions.add(curPlayer.player.data.position.data.name);
      return curPlayer.player.data.display_name;
    }))
    });
  let ppp = Array.from(playersPositions);
  return {teamsNames:teamsNames, playersNames: playersNames, positions: ppp }
}

exports.getLeagueData = getLeagueData;
exports.getAllLeagueGames = getAllLeagueGames;
exports.getCurrentStageGames = getCurrentStageGames;
exports.getSeachData = getSeachData;
