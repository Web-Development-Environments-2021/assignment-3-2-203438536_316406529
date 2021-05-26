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
  // const next_game = await DButils.execQuery('')
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
  };
}

async function getAllLeagueGames(username){
  return favorites_utils.getFavoritesUserGames(username);
}
exports.getLeagueData = getLeagueData;
exports.getAllLeagueGames = getAllLeagueGames;
