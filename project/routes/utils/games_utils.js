
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

async function AddGame(data){
  try{
    // const {date, hour, away_team_id, home_team_id, field} = data;
    // let ref = data.referee_name;
    const hour = data.hour;
    await DButils.execQuery(
      `insert into dbo.games2 (game_date, game_hour, home_team, away_team, field, referee_name) 
       values ('${data.date}', '${data.hour}', '${data.home_team}', '${data.away_team}', '${data.field}', '${data.referee_name}') `);
  }catch(error){
    error;
  }
}

// async function AddScore(data){
//   try{
//     const gameId = data.body.game_id;
//     const awayTeamGoal = data.body.away_team_goal;
//     const homeTeamGoal = data.body.home_team_goal;
//     await DButils.execQuery(` `);

//   }
// }

exports.AddGame = AddGame;