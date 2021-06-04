CREATE TABLE Users(
	[user_id] [int] IDENTITY(1,1) NOT NULL,
    [username] [varchar](30) NOT NULL PRIMARY KEY,
    [firstname] [varchar](300) NOT NULL,
    [lastname] [varchar](300) ,
    [country] [varchar](300) ,
    [password] [varchar](300),
    [email] [varchar](300) ,
    [picture] [varchar](300) 
)