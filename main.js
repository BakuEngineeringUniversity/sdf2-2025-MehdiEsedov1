const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");

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
  try {
    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "llama3",
        prompt: prompt,
        stream: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.response;
  } catch (err) {
    console.error("Error:", err.message);
  }
});
