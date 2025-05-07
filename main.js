const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const https = require("https");
const http = require("http");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("ask-ollama", async (event, prompt) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 11434,
        path: "/api/generate",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk.toString();
        });
        res.on("end", () => {
          const lines = data.trim().split("\n");
          const final = lines.map((line) => JSON.parse(line).response).join("");
          resolve(final);
        });
      }
    );

    req.on("error", reject);

    req.write(
      JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: true,
      })
    );
    req.end();
  });
});
