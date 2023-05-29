// alert("Welcome to this live dashboard");

let darkToggle = document.getElementById("toggle");
let isLight = localStorage.getItem("isLight") === "true";
let socket = io();
const form = document.getElementById("scoreForm");

let buttonn = document.querySelector(".input-goals-button");
let thisform = document.getElementById("scoreForm");

buttonn.addEventListener("click", () => {
  thisform.classList.toggle("show");
});

if (isLight) {
  document.body.classList.add("light");
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("isLight", document.body.classList.contains("light"));
});

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const homeScore = document.querySelector('input[name="hometeam"]').value;
  const awayScore = document.querySelector('input[name="pretendteam"]').value;

  console.log(homeScore);
  console.log(awayScore);

  // Send the updated scores to the server via Socket.IO
  socket.emit("updateScore", { homeScore, awayScore });
});

socket.on("scoreUpdated", function (data) {
  const homeScoreDisplay = document.getElementById("homeScoreDisplay");
  const awayScoreDisplay = document.getElementById("awayScoreDisplay");

  // Update the score display elements
  homeScoreDisplay.textContent = data.homeScore;
  awayScoreDisplay.textContent = data.awayScore;
});

const cardArea = document.querySelectorAll(".cards");
const playerArea = document.querySelectorAll(".card-player");
const btnScale = document.getElementById("scale");

console.log(playerArea);

btnScale.addEventListener("click", () => {
  cardArea.forEach((toggle) => {
    toggle.classList.toggle("scalecardArea");
  });

  playerArea.forEach((element) => {
    element.classList.toggle("scalecardplayer");
  });
});
