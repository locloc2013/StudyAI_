const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const USERS_FILE = "users.json";
const CHATS_FILE = "chats.json";

// đọc file
const readFile = (file) => {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
};

// ghi file
const writeFile = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// đăng ký
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  let users = readFile(USERS_FILE);

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "Tài khoản đã tồn tại" });
  }

  users.push({ username, password });
  writeFile(USERS_FILE, users);

  res.json({ success: true });
});

// đăng nhập
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let users = readFile(USERS_FILE);

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.json({ success: false });
  }

  res.json({ success: true });
});

// lưu chat
app.post("/chat", (req, res) => {
  const { username, message } = req.body;
  let chats = readFile(CHATS_FILE);

  const reply = generateReply(message);

  chats.push({ username, message, reply });
  writeFile(CHATS_FILE, chats);

  res.json({ reply });
});

// lấy lịch sử
app.get("/history/:username", (req, res) => {
  let chats = readFile(CHATS_FILE);
  const userChats = chats.filter(c => c.username === req.params.username);
  res.json(userChats);
});

// xóa lịch sử
app.delete("/history/:username", (req, res) => {
  let chats = readFile(CHATS_FILE);
  chats = chats.filter(c => c.username !== req.params.username);
  writeFile(CHATS_FILE, chats);
  res.json({ success: true });
});

// AI trả lời
function generateReply(msg) {
  if (msg.toLowerCase().includes("2+2")) {
    return "Kết quả là: **2 + 2 = 4** 😊";
  }

  return `✨ Trả lời:

${msg}

👉 Đây là câu trả lời mẫu. Bạn có thể tích hợp AI thật sau!`;
}

app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
