// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api/";
const COHORT = "2508-FTB-ET-WEB-FT"; // Make sure to change this!
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;

let players = [];
let selectedPlayer;

async function getPlayers() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    players = result.data.players;
    // console.log(players[0]);
    render();
  } catch (error) {
    console.error("Uh oh, trouble fetching players!", err);
  }
}
