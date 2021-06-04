CREATE TABLE ScheduleEvents(
    [event_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [game_id] [int] NOT NULL,
    [event_date] [DATE] NOT NULL,
    [event_hour] [TIME] NOT NULL,
    [game_minute] [int] NOT NULL,
    [event_type] [varchar](300) NOT NULL,
    [player_id] [int] NOT NULL
)