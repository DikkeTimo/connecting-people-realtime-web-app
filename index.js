// Import the required modules
import * as path from "path";

import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

// Create a new Express app
const app = express();
const http = createServer(app);
const ioServer = new Server(http);
const port = process.env.PORT || 4242;

const url = ["https://raw.githubusercontent.com/fdnd-agency/ultitv/main/ultitv-api"];
const postUrl = "https://api.ultitv.fdnd.nl/api/v1/players?first=20";
const apiUrl = "https://api.ultitv.fdnd.nl/api/v1/questions";
const urls = [
  [url] + "/game/943.json",
  [url] + "/game/943/statistics.json",
  [url] + "/facts/Player/8607.json",
  [postUrl],
  [apiUrl],
];

// Set EJS as the template engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

ioServer.on("connection", (client) => {
  console.log(`user ${client.id} connected`);

  client.on("disconnect", () => {
    console.log("User disconnected");
  });

  client.on('updateScore', function(data) {
    // Update the scores here
    const homeScore = data.homeScore;
    const awayScore = data.awayScore;
    
    // Broadcast the updated scores to all connected clients
    client.emit('scoreUpdated', { homeScore, awayScore });
  });
});

http.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});

app.get("/", async function (request, response) {
  const [data1, data2, data3, data4, data5] = await Promise.all(urls.map(fetchJson));
  const data = { data1, data2, data3, data4, data5 };

  response.render("index", data);
});

app.get("/post", async function (request, response) {
  const [data1, data2, data3, data4, data5] = await Promise.all(urls.map(fetchJson));
  const data = { data1, data2, data3, data4, data5 };

  response.render("post", data);
});

app.post("/form", (request, response) => {
  request.body.answers = [
    {
      content: request.body.content,
      questionId: request.body.question,
    },
    /* Met request.body stuur je geparced json data naar de endpoint, in dit geval naar Posturl */
  ];
  postJson(postUrl, request.body).then((data) => {
    if (data.success) {
      response.redirect("/?memberPosted=true");
    }
    response.redirect("/");
  });
});

async function fetchJson(urls) {
  return await fetch(urls)
    .then((response) => response.json())
    .catch((error) => error);
}

export async function postJson(url, body) {
  return await fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => error);
}
