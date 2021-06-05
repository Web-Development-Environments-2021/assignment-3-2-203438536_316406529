CREATE TABLE games(
	[game_id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[game_date] [varchar](200) NOT NULL,
	[game_hour] [varchar](200) NOT NULL,
	[home_team] [varchar](300) NULL,
	[away_team] [varchar](300) NULL,
	[home_team_id] [int] NULL,
	[away_team_id] [int] NULL,
	[home_team_goal] [int] NULL,
	[away_team_goal] [int] NULL,
	[field] [varchar](300) NULL,
	[referee_name] [varchar](300) NULL,
)