# ![logo](https://i.imgur.com/qS43soQ.png)
service for sharing animations created with clipnote studio.
# Setup
Run `npm install` to install the required packages and then start it with `npm start`.

## Database Setup
 Create a database (named 'clip' by default, can be changed in config.json) and run the database.sql file to set it up.
 
 ```
 mysql>create database clip;
 mysql>use clip;
 mysql>source /path/to/setup/database.sql;
 ```
 ## Config Setup
  Copy the example config file in /setup to the root directory and rename it to config.json. Change it as necessary.
