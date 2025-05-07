const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  askLLM: (prompt) => ipcRenderer.invoke("ask-ollama", prompt),
});
