

async function getGamesInfo(games_ids_list) {//return list of games info
    return games_ids_list.map((gameID) => {
        const game = await DButils.execQuery(
            `select * from userFavoriteGames WHERE gameID='${gameID}'`
          );
        return game;
      });
  }