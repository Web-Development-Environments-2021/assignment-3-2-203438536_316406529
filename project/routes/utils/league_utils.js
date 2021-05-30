const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const favorites_utils = require("./favorites_utils");


async function getLeagueData() {
  const league = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(`${api_domain}/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  let currentDate= new Date().toISOString();
  //need to fix this query
  const nextGame = await DButils.execQuery(`select top 1 game_date, game_hour, home_team, away_team, field \
  from dbo.games2 WHERE game_date >= '${currentDate}'  ORDER BY game_date ASC, game_hour ASC` 
  );
  const {game_hour,game_date, home_team, away_team, field} = nextGame[0];
  let game_hour_split = String(game_hour).slice(16,25);
  let game_date_split = String(game_date).slice(0,15);

  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
    nextComingGame: {
      game_date: game_date_split,
      game_hour: game_hour_split,
      home_team: home_team,
      away_team: away_team,
      field: field
    }
  };
}

async function getCurrentStageGames(){
  const currentDate = new Date().toISOString();
  const futureStagegames = await DButils.execQuery(`select game_date, game_hour, home_team, away_team, field \
  from dbo.games2 WHERE game_date >= '${currentDate}'  ORDER BY game_date ASC` 
  );
  const pastStageGames = await DButils.execQuery(`select game_date, game_hour, home_team, away_team, field \
  from dbo.games2 WHERE game_date < '${currentDate}'  ORDER BY game_date ASC` 
  );
  return{
    pastGamesList: pastStageGames,
    futureGamesList: futureStagegames,
  }
}

async function getAllLeagueGames(username){
  //return favorites_utils.getFavoritesUserGames(username);
}

exports.getLeagueData = getLeagueData;
exports.getAllLeagueGames = getAllLeagueGames;
exports.getCurrentStageGames = getCurrentStageGames;
