const axios = require("axios");
const DButils = require("./DButils");
// const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getGamesInfo(games_ids_list) {
  //return list of games info
  // we remove the await
  return games_ids_list.map((gameID) => {
    const game = DButils.execQuery(
      `select * from userFavoriteGames WHERE gameID='${gameID}'`
    );
    return game;
  });
}

async function AddGame(data) {
  try {
    // const {date, hour, away_team_id, home_team_id, field} = data;
    // let ref = data.referee_name;
    const hour = data.hour;
    await DButils.execQuery(
      `insert into dbo.games (game_date, game_hour, home_team, away_team, field, referee_name) 
       values ('${data.date}', '${data.hour}', '${data.home_team}', '${data.away_team}', '${data.field}', '${data.referee_name}') `
    );
  } catch (error) {
    error;
  }
}

async function AddScoresToGame(gameId, homeGoal, awayGoal) {
  try {
    await DButils.execQuery(
      `UPDATE dbo.games SET home_team_goal = ${homeGoal}, away_team_goal =${awayGoal} WHERE game_id = ${gameId}`
    );
  } catch (error) {
    error;
  }
}

async function checkIfGameOccur(game_id) {
  game_id_num = Number(game_id);
  const gameDetails = await DButils.execQuery(
    `SELECT game_date, game_hour from dbo.games WHERE game_id = ${game_id_num}`
  );
  const games = await DButils.execQuery(`select * from dbo.games`);
  if (gameDetails[0]) {
    const currentDate = new Date().toISOString();
    let gameDate = new Date(gameDetails[0].game_date).toISOString();
    if (currentDate > gameDate) {
      return true;
    } else {
      return false;
    }
  }
}

// async function AddEventToGame(game_id, date, hour, game_minute, event_description){

// }

exports.AddGame = AddGame;
exports.AddScoresToGame = AddScoresToGame;
exports.checkIfGameOccur = checkIfGameOccur;
exports.getGamesInfo = getGamesInfo;
