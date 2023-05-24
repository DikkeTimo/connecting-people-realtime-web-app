let darkToggle = document.getElementById("toggle");
let isLight = localStorage.getItem("isLight") === "true";

if (isLight) {
  document.body.classList.add("light");
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("isLight", document.body.classList.contains("light"));
});

let socket = io();
const form = document.getElementById("scoreForm");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const homeScore = document.querySelector('input[name="hometeam"]').value;
  const awayScore = document.querySelector('input[name="pretendteam"]').value;

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
