const input = document.getElementById("textInput");
const messageBox = document.getElementById("messageBox");
const clearBtn = document.getElementById("clearBtn");
const toggleChatBtn = document.getElementById("toggleChatBtn");
const chatSidebar = document.getElementById("chatSidebar");
const popup = document.getElementById("rotatePopup"); // ✅ only one popup

// Diary data
let diary = JSON.parse(localStorage.getItem("diaryLog")) || [];

function renderDiary() {
  messageBox.innerHTML = "";
  diary.forEach(entry => {
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `${entry.text}<span class="time">${entry.time}</span>`;
    messageBox.appendChild(div);
  });
  messageBox.scrollTop = messageBox.scrollHeight;
}
renderDiary();

// Sounds
const typeSound = new Audio("typing.mp3");
const fallSound = new Audio("fall.mp3");

// Falling letters
input.addEventListener("input", e => {
  const val = e.target.value;
  const lastChar = val.slice(-1);
  if (!lastChar || lastChar === "\n") return;

  typeSound.currentTime = 0;
  typeSound.play().catch(() => {});

  const span = document.createElement("span");
  span.textContent = lastChar;
  span.className = "letter";

  const size = 60 + Math.random() * 60;
  span.style.fontSize = size + "px";
  span.style.left = Math.random() * 100 + "vw";
  span.style.color = `hsl(${Math.random() * 360},70%,60%)`;

  document.body.appendChild(span);

  setTimeout(() => {
    fallSound.currentTime = 0;
    fallSound.play().catch(() => {});
  }, 200);

  setTimeout(() => span.remove(), 3000);
});

// Enter saves entry
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
      const entry = { text: val, time: new Date().toLocaleString() };
      diary.push(entry);
      localStorage.setItem("diaryLog", JSON.stringify(diary));
      renderDiary();
    }
    input.value = "";
  }
});

// Clear all
clearBtn.addEventListener("click", () => {
  diary = [];
  localStorage.removeItem("diaryLog");
  renderDiary();
  input.value = "";
});

// ✅ Fixed orientation popup
function checkOrientation() {
  const isMobileScreen = window.innerWidth <= 768; // consider ≤768px as mobile
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isMobileScreen && isPortrait) {
    popup.style.display = "flex";  // show popup
  } else {
    popup.style.display = "none";  // hide popup
  }
}

// ✅ Only once — no duplicates
["load", "resize", "orientationchange"].forEach(evt =>
  window.addEventListener(evt, checkOrientation)
);

// Toggle chat sidebar
toggleChatBtn.addEventListener("click", () => {
  chatSidebar.classList.toggle("open");
});
