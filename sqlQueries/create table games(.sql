create table games(
	[game_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[game_date] [DATE] NOT NULL,
	[game_hour] [TIME] NOT NULL,
	[home_team] [varchar](300),
	[away_team] [varchar](300),
	[home_team_id] int,
	[away_team_id} int,
	[home_team_goal] int,
	[away_team_goal] int,
	[field] varchar(300),
	[referee_name] varchar(300)
)