const axios = require("axios");
const DButils = require("./DButils");
const team_utils = require("./teams_utils");
// const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getGamesInfo(games_ids_list) {
  //return list of games info
  // we remove the await
  let promises = [];
  games_ids_list.map((row) => promises.push(getGameDetaildByID(row.gameID)));
  let games_info = await Promise.all(promises);
  return games_info;
}

async function AddGame(data) {
  try {
    // const {date, hour, away_team_id, home_team_id, field} = data;
    // let ref = data.referee_name;
    const home_team_name = await team_utils.getTeamNameById(data.home_team_id);
    const away_team_name = await team_utils.getTeamNameById(data.away_team_id);
    await DButils.execQuery(
      `insert into dbo.games (game_date, game_hour, home_team, away_team, home_team_id, away_team_id, field, referee_name) 
       values ('${data.date}', '${data.hour}', '${home_team_name}', '${away_team_name}','${data.home_team_id}','${data.away_team_id}', '${data.field}', '${data.referee_name}') `
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

function convertDateAndHour(date, hour) {
  let game_hour = String(hour).slice(16, 25);
  let game_date = String(date).slice(0, 15);
  return {
    date: game_date,
    hour: game_hour,
  };
}

async function checkIfGameOccur(game_id) {
  game_id_num = Number(game_id);
  const gameDetails = await DButils.execQuery(
    `SELECT game_date, game_hour from dbo.games WHERE game_id = ${game_id_num}`
  );

  //const games = await DButils.execQuery(`select * from dbo.games`);
  if (gameDetails[0]) {
    const date_hour_convert = convertDateAndHour(
      gameDetails[0].game_date,
      gameDetails[0].game_hour
    );
    const gameInFuture = checkIfGameDetailsInFuture(
      date_hour_convert.date,
      date_hour_convert.hour
    );
    // const gameInFuture = checkIfGameDetailsInFuture(
    //   gameDetails[0].game_date,
    //   gameDetails[0].game_hour
    // );

    if (gameInFuture) {
      return false;
    } else {
      return true;
    }
  }
}

async function getGameDetaildByID(game_id) {
  const game = await DButils.execQuery(
    `select * from dbo.games where game_id = ${game_id} `
  );

  if (game[0]) {
    // game exist in the DB
    const gameEvents = await DButils.execQuery(
      `select * from ScheduleEvents WHERE game_id = ${game_id}`
    );
    let gameEventsLits = [];
    gameEvents.map((event) => {
      gameEventsLits.push(event);
    });
    const occured = await checkIfGameOccur(game_id);
    const {
      game_date,
      game_hour,
      home_team,
      away_team,
      home_team_id,
      away_team_id,
      home_team_goal,
      away_team_goal,
      field,
    } = game[0];
    let game_hour_split = String(game_hour).slice(16, 25);
    let game_date_split = String(game_date).slice(0, 15);
    // let game_date_split = new Date(game_date)
    //   .toLocaleDateString()
    //   .split(",")[0];
    return {
      game_id: game_id,
      game_date: game_date_split,
      game_hour: game_hour_split,
      home_team: home_team,
      away_team: away_team,
      home_team_id: home_team_id,
      away_team_id: away_team_id,
      home_team_goal: home_team_goal,
      away_team_goal: away_team_goal,
      field: field,
      eventSchedule: gameEventsLits,
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

function checkIfGameDetailsInFuture(date, hour) {
  let check;
  const currentDate = new Date().toLocaleString().split(",");
  const toDay = new Date();
  const gameDate = new Date(date);
  if (toDay > gameDate) {
    check = false;
  } else if (toDay < gameDate) {
    check = true;
  } else {
    const nowHour = currentDate[1].split(":")[0];
    const gameHour = hour.split(":")[0];
    // const toDayHour = Number();
    // const gameHour = Number(hour.split(":"));
    if (nowHour < gameHour) {
      check = true;
    } else {
      check = false;
    }
  }

  return check;
}

async function checkGameDetails(data) {
  let message = "";
  const gameAtSameTime = await DButils.execQuery(
    `select home_team_id, away_team_id, field from dbo.games WHERE game_date ='${data.date}' AND game_hour='${data.hour}'`
  );
  if (
    gameAtSameTime.find(
      (x) =>
        x.home_team_id === data.home_team_id ||
        x.away_team_id === data.away_team_id
    )
  ) {
    message += "One or Both teams already embedded  in this time.\n";
  }
  if (gameAtSameTime.find((x) => x.field === data.field)) {
    message += "The field already embedded in this time";
  }
  return message;
}

async function getAllLeagueGames() {
  try {
    const games = await DButils.execQuery(`select * from dbo.games `);
    return games;
  } catch {
    return false;
  }
}

async function checkIFPlayerInGame(game_id, player_id) {
  try {
    game_id_num = Number(game_id);
    const gameDetails = await DButils.execQuery(
      `SELECT home_team_id, away_team_id from dbo.games WHERE game_id = ${game_id_num}`
    );
    if (gameDetails[0]) {
      const home_team_id = gameDetails[0].home_team_id;
      const away_team_id = gameDetails[0].away_team_id;
      const playerExist = await team_utils.checkPlayerInTeam(
        player_id,
        home_team_id,
        away_team_id
      );
      if (playerExist) {
        return true;
      }
      return false;
    }
    return false;
  } catch {
    return false;
  }
}

exports.AddGame = AddGame;
exports.AddScoresToGame = AddScoresToGame;
exports.checkIfGameOccur = checkIfGameOccur;
exports.getGamesInfo = getGamesInfo;
exports.getGameDetaildByID = getGameDetaildByID;
exports.AddEventToGame = AddEventToGame;
exports.checkIfGameDetailsInFuture = checkIfGameDetailsInFuture;
exports.getAllLeagueGames = getAllLeagueGames;
exports.checkGameDetails = checkGameDetails;
exports.checkIFPlayerInGame = checkIFPlayerInGame;
