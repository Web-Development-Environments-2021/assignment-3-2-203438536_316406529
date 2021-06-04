const axios = require("axios");
const DButils = require("./DButils");
// const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getGamesInfo(games_ids_list) {
  //return list of games info
  // we remove the await
  let promises = [];
  games_ids_list.map((row) => 
    promises.push(getGameDetaildByID(row.gameID))
  );
  let games_info = await Promise.all(promises);
  return games_info;
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

async function getGameDetaildByID(game_id) {
  const game = await DButils.execQuery(
    `select * from dbo.games where game_id = ${game_id} `
  );
  if (game[0]) {
    // game exist in the DB
    const occured = await checkIfGameOccur(game_id);
    const {
      game_date,
      game_hour,
      home_team,
      away_team,
      home_team_goal,
      away_team_goal,
      filed,
    } = game[0];
    let game_hour_split = String(game_hour).slice(16, 25);
    let game_date_split = String(game_date).slice(0, 15);
    return {
      game_date: game_date_split,
      game_hour: game_hour_split,
      home_team: home_team,
      away_team: away_team,
      home_team_goal: home_team_goal,
      away_team_goal: away_team_goal,
      filed: filed,
    };
  } else {
    return "Game does not exist in DB";
  }
}

async function AddEventToGame(data) {
  try {
    const { game_id, date, hour, game_minute, event_type, player_id } = data;
    await DButils.execQuery(`insert into dbo.ScheduleEvents (game_id, event_date, event_hour, game_minute, event_type, player_id) 
  values ('${game_id}', '${date}', '${hour}', '${game_minute}' , '${event_type}', '${player_id}') `);
  } catch (error) {
    error;
  }
}

async function checkIfEventAvailable(data) {
  //The function checks if the game date and hour are legal in order to add event.
  //We decided to allow adding event only if the game date is before or equal to the current name
  //The game_hour + game minute of the event is equal to the event hour
  const { game_id, date, hour, game_minute, player_id } = data;
  const currentDate = new Date().toISOString();
  const gameDate = new Date(date).toISOString();
  if (currentDate >= gameDate && game_hour <= hour + game_minute) {
    //game didnt occur
    return true;
  } else {
    return flase;
  }
}

exports.AddGame = AddGame;
exports.AddScoresToGame = AddScoresToGame;
exports.checkIfGameOccur = checkIfGameOccur;
exports.getGamesInfo = getGamesInfo;
exports.getGameDetaildByID = getGameDetaildByID;
exports.AddEventToGame = AddEventToGame;