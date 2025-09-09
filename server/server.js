const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const FILE = "messages.txt";

// Настройки ограничений
const MAX_MESSAGE_LENGTH = 500; // макс. длина сообщения
const MESSAGE_INTERVAL = 5 * 1000; // 5 секунд между сообщениями от одного имени

// Хранилище времени последнего сообщения по имени
const lastMessageTime = {};

// Получить все сообщения
app.get("/messages", (req, res) => {
  fs.readFile(FILE, "utf8", (err, data) => {
    if (err) return res.json([]);
    try {
      const messages = data.trim() ? JSON.parse(data) : [];
      res.json(messages);
    } catch {
      res.json([]);
    }
  });
});

// Добавить сообщение
app.post("/messages", (req, res) => {
  const { name, text } = req.body;

  if (!name || !text) return res.status(400).send("Некорректные данные");

  // Проверка длины
  if (text.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).send(`Сообщение слишком длинное (макс ${MAX_MESSAGE_LENGTH} символов)`);
  }

  const now = Date.now();
  if (lastMessageTime[name] && now - lastMessageTime[name] < MESSAGE_INTERVAL) {
    return res.status(429).send(`Подождите ${Math.ceil((MESSAGE_INTERVAL - (now - lastMessageTime[name])) / 1000)} секунд перед следующим сообщением`);
  }

  fs.readFile(FILE, "utf8", (err, data) => {
    let messages = [];
    if (!err && data.trim()) {
      try {
        messages = JSON.parse(data);
      } catch {}
    }

    const newMessage = {
      id: Date.now(),
      name,
      text,
      timestamp: new Date().toLocaleString("ru-RU")
    };

    messages.unshift(newMessage);

    fs.writeFile(FILE, JSON.stringify(messages, null, 2), () => {
      lastMessageTime[name] = now;
      res.json({ status: "ok" });
    });
  });
});

const PORT = process.env.PORT || 41957;
app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
