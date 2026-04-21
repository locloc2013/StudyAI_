let username = "";

// đăng ký
async function register() {
  const res = await fetch("/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();
  alert(data.success ? "Đăng ký thành công!" : data.message);
}

// đăng nhập
async function login() {
  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();

  if (data.success) {
    username = user.value;
    document.getElementById("login").style.display = "none";
    document.getElementById("chatApp").style.display = "block";

    document.getElementById("welcome").innerText =
      `Chào ${username} yêu! Tớ có thể giúp bạn học tập 🥳`;

    new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3").play();
  } else {
    alert("Sai tài khoản!");
  }
}

// gửi tin
async function send() {
  const msg = document.getElementById("msg").value;
  addMsg(msg, "user");

  document.getElementById("msg").value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, message: msg })
  });

  const data = await res.json();

  typeEffect(data.reply);
}

// hiệu ứng typing
function typeEffect(text) {
  let i = 0;
  let box = document.createElement("div");
  box.className = "bot";
  chatBox.appendChild(box);

  let interval = setInterval(() => {
    box.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 20);
}

// hiển thị tin
function addMsg(msg, cls) {
  let div = document.createElement("div");
  div.className = cls;
  div.innerText = msg;
  chatBox.appendChild(div);
}

// enter gửi
function enterSend(e) {
  if (e.key === "Enter") send();
}

// mic
function startMic() {
  const rec = new webkitSpeechRecognition();
  rec.lang = "vi-VN";

  rec.onresult = function(e) {
    msg.value = e.results[0][0].transcript;
  };

  rec.start();
}

// load history
async function loadHistory() {
  const res = await fetch(`/history/${username}`);
  const data = await res.json();

  chatBox.innerHTML = "";
  data.forEach(c => {
    addMsg(c.message, "user");
    addMsg(c.reply, "bot");
  });
}

// xóa lịch sử
async function clearHistory() {
  await fetch(`/history/${username}`, { method: "DELETE" });
  chatBox.innerHTML = "";
}
