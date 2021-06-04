CREATE TABLE userFavoriteGames(
    [username] [varchar](30) NOT NULL,
    [gameID] [varchar](300) NOT NULL,
    PRIMARY KEY(username,gameID)
)