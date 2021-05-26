
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
    await DButils.execQuery(
      `insert into dbo.games2 (game_date, game_hour, home_team_id, away_team_id, field, referee_name) 
       values ('${data.date}', '${data.hour}', '${data.home_team_id}', '${data.away_team_id}', '${data.field}', '${data.referee_name}') `);
  }catch(error){
    error;
  }
}

exports.AddGame = AddGame;