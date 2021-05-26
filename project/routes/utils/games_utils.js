
const axios = require("axios");
const DButils = require("./DButils");
// const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getGamesInfo(games_ids_list) {//return list of games info
    return games_ids_list.map((gameID) => {
        const game = await DButils.execQuery(
            `select * from userFavoriteGames WHERE gameID='${gameID}'`
          );
        return game;
      });
}

async function AddGame(data){
  try{
    const {date, hour, away_team_id, home_team_id, field, referee_name} = data.session;
    await DButils.execQuery(
      `insert into dbo.Games values (${date}, ${hour}, ${home_team_id}, ${away_team_id},
          ${field}, ${referee_name}) `);
  }catch(error){
    error;
  }
}

exports.AddGame = AddGame;