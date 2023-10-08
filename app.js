const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, `cricketTeam.db`);

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//GET ALL PLAYERS LIST

app.get("/players/", async (request, response) => {
  const listOfPlayers = `
    SELECT 
      *
    FROM
        cricket_team;`;

  const playersList = await db.all(listOfPlayers);
  response.send(playersList);
});

//ADD NEW PLAYER

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = playerDetails;
  const addPlayer = `
    INSERT INTO 
        book(player_id, player_name, jersey_number, role);
    VALUES 
        (${playerId},
         ${playerName},
         ${jerseyNumber},
         ${role});`;
  const dbResponse = await db.run(playerDetails);
  const newPlayerId = dbResponse.lastID;
  response.send = "Player added to team";
});

//RETURN A PLAYER
app.get(`/players/:playerId/`, async (response, request) => {
  const { playerId } = request.params;
  const returnAPlayer = `
        SELECT 
          *
        FROM
          cricket_team
        WHERE 
          player_Id = ${playerId};`;
  const player = await db.get(returnAPlayer);
  response.send(player);
});

//Update A Player

app.put(`/players/:playerId/`, async (response, request) => {
    const {playerId} = request.params;
    const playerDetails = request.body;
    const 
        { playerId, playerName, jerseyNumber, role } = playerDetails;
    const updateCricketTeam = `
    UPDATE 
        cricket_team
    SET
        player_id = ${playerId},
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
    WHERE 
        player_id = ${playerId};`;
    const await db.run("updateCricketTeam");
    response.send("Player Details Updated");
        
});

//DELETE A PLAYER

app.delete(`/players/:playerId/`, async (response, request) =>{
    const {playerId} = request.params;
    const deletePlayer = `
    DELETE FROM 
        cricket_team
    WHERE 
        player_id = ${playerId};`;
    await db.run(deletePlayer);
    response.send("player removed")
    
})
