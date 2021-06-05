CREATE TABLE ScheduleEvents(
    [event_id] [int] IDENTITY(1,1) NOT NULL,
    [game_id] [int] NOT NULL,
    [event_date] [varchar](300) NOT NULL,
    [event_hour] [varchar](300) NOT NULL,
    [game_minute] [int] NOT NULL,
    [event_type] [varchar](300) NOT NULL,
    [player_id] [int] NOT NULL,
    PRIMARY KEY (game_id, event_date, event_hour, game_minute, event_type)
)