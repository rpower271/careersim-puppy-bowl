// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api/";
const COHORT = "2508-FTB-ET-WEB-FT"; // Make sure to change this!
const API = BASE + COHORT;

let players = [];
let selectedPlayer;

async function getPlayers() {
  try {
    const response = await fetch(API + "/players");
    const result = await response.json();
    players = result.data.players;
    console.log(players);
    render();
  } catch (error) {
    console.error("Uh oh, trouble fetching players!", error);
  }
}
getPlayers();

async function getPlayer(id) {
  try {
    console.log(id);
    const response = await fetch(API + "/players" + id);
    const results = await response.json();
    selectedPlayer = result.data.player;
    console.log(selectedPlayer);
    render();
  } catch (error) {
    console.error("could not return player", error);
  }
}
getPlayer();

function SelectedPlayer() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a player to learn more";
    return $p;
  }
  const $player = document.createElement("section");
  $player.innerHTML = `
    <h3>${selectedPlayer.name} #${selectedPlayer.id}</h3>
    <p>Breed: ${selectedPlayer.breed}</p>
    <p> Status: ${selectedPlayer.status}</p>
    <img src="${selectedPlayer.imageUrl}" alt="${selectedPlayer.name}">
    <p> TeamId: ${selectedPlayer.teamId}</p>
    <button>Remove Player</button>
    `;

  const $delete = $player.querySelector("button");
  $delete.addEventListener("click", () => deletedPlayer(selectedPlayer.id));

  return $player;
}

function PlayerListItem(player) {
  const $li = document.createElement("li");

  if (selectedPlayer && player.id === selectedPlayer.id) {
    $li.classList.add("selected");
  }
  $li.innerHTML = `
    <a href="#selected">${player.name}</a>
    `;
  $li.addEventListener("click", () => getPlayer(player.id));
  return $li;
}
// console.log(PlayerListItem);

function PlayerList() {
  const $ul = document.createElement("ul");
  $ul.CLASSlAST.ASS("players");
  const $players = players.map(PlayerListItem);
  $ul.replaceChildren(...$players);
  return $ul;
}
