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
// getPlayers();

async function getPlayer(id) {
  try {
    console.log(id);
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    selectedPlayer = result.data.player;
    console.log(selectedPlayer);
    render();
  } catch (error) {
    console.error("could not return player", error);
  }
}
// getPlayer();

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
  $ul.classList.add("players");
  const $players = players.map(PlayerListItem);
  $ul.replaceChildren(...$players);
  return $ul;
}

async function deletedPlayer(id) {
  try {
    await fetch(API + "/players" + id, {
      method: "DELETE",
    });
    selectedPlayer = undefined;
    await getPlayers();
  } catch (error) {
    console.error(error);
  }
}

function NewPlayerForm() {
  const $form = document.createElement("form");

  $form.style.display = "flex";
  $form.style.flexDirection = "column";
  $form.style.gap = "10px";
  $form.style.padding = "20px";
  $form.style.border = "1px solid #ccc";
  $form.style.borderRadius = "8px";
  $form.style.width = "300px";
  $form.style.marginTop = "20px";

  $form.innerHTML = `
    <h2>Add New Player</h2>
    <input name="name" placeholder="Player Name" required />
    <input name="breed" placeholder="Breed" required />
    <input name="status" placeholder="status" />
    <input name="imageUrl" placeholder="image URL" />
    <textarea name="teamId" placeholder="teamId" ></textarea>
    <button type="submit">Add Player</button>
    `;
  $form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newPlayer = {
      name: formData.get("name"),
      breed: formData.get("breed"),
      status: formData.get("status"),
      imageUrl: formData.get("imageUrl"),
      teamId: formData.get("teamId"),
    };
    try {
      const response = await fetch(API + "/players", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newPlayer),
      });

      if (!response.ok) throw new Error("failed to create player");

      await getPlayers();
      $form.reset();
    } catch (error) {
      console.error(error);
    }
    event.target.reset();
  });
  return $form;
}

function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section>
        <h2>Current Players</h2>
        <PlayerList></PlayerList>
      </section>
      <section id="selected">
        <h2>Player Details</h2>
        <SelectedPlayer></SelectedPlayer>
         <section id="create-player">
        <NewPlayerForm></NewPlayerForm>
      </section>
    </main>
  `;

  $app.querySelector("PlayerList").replaceWith(PlayerList());
  $app.querySelector("SelectedPlayer").replaceWith(SelectedPlayer());
  $app.querySelector("NewPlayerForm").replaceWith(NewPlayerForm());
}

async function init() {
  await getPlayers();
  render();
}

init();
