const chatbox = document.getElementById("chatbox");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChatBtn");

let currentChatId = null;
let chatHistory = {};

function renderChat() {
  chatbox.innerHTML = "";
  const messages = chatHistory[currentChatId] || [];

  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.classList.add("message", msg.sender);
    div.innerText = msg.text;
    chatbox.appendChild(div);
  });

  chatbox.scrollTop = chatbox.scrollHeight;
}

sendBtn.onclick = async () => {
  const prompt = promptInput.value.trim();
  if (!prompt || !currentChatId) return;

  addMessage(prompt, "user");

  const response = await window.electronAPI.askLLM(prompt);
  addMessage(response, "bot");
};

function addMessage(text, sender) {
  if (!chatHistory[currentChatId]) chatHistory[currentChatId] = [];
  chatHistory[currentChatId].push({ sender, text });
  renderChat();
}

let i = 0;

newChatBtn.onclick = () => {
  i++;
  currentChatId = "chat-" + i;
  chatHistory[currentChatId] = [];
  addChatToSidebar(currentChatId);
  renderChat();
};

function addChatToSidebar(chatId) {
  const li = document.createElement("li");
  li.innerText = "Chat " + chatId.split("-")[1];
  li.onclick = () => {
    currentChatId = chatId;
    renderChat();
  };
  chatList.appendChild(li);
}

newChatBtn.click();

// chatHistory = {
//   "chat-1": [
//     { sender: "user", text: "Müəllim, işə götürərsiz?" },
//     { sender: "bot", text: "Dərsdən sonra yaxınlaş." },
//   ],
//   "chat-2": [
//     { sender: "user", text: "Müəllim, 15 yazarsız?" },
//     { sender: "bot", text: "FF-ə də 10 yazdım get" },
//   ],
// };
