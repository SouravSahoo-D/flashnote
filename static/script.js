function startApp() {
  document.getElementById("consent-screen").style.display = "none";
  document.getElementById("main-interface").style.display = "block";
  startInactivityTimer();
}

function sendText() {
  const text = document.getElementById("noteArea").value.trim();
  if (!text) {
    alert("Please type something first.");
    return;
  }
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

function captureNoteAsImage() {
  const container = document.getElementById("noteSnapshotContainer");
  html2canvas(container).then(canvas => {
    const link = document.createElement('a');
    link.download = 'flashnote_note.png';
    link.href = canvas.toDataURL();
    link.click();

    setTimeout(() => {
      window.open('https://wa.me', '_blank');
    }, 500);
  });
}

let timer;
function startInactivityTimer() {
  resetTimer();
  ['mousemove', 'keydown', 'touchstart'].forEach(event =>
    document.addEventListener(event, resetTimer)
  );
}

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    alert("Session expired. Your note has been cleared.");
    location.reload();
  }, 180000); // 3 minutes
}

// ========== Drawing Support ==========
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseout", stopDraw);

canvas.addEventListener("touchstart", startDraw, { passive: true });
canvas.addEventListener("touchmove", drawTouch, { passive: true });
canvas.addEventListener("touchend", stopDraw);

function getPosition(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX - canvas.getBoundingClientRect().left,
      y: e.touches[0].clientY - canvas.getBoundingClientRect().top
    };
  } else {
    return {
      x: e.clientX - canvas.getBoundingClientRect().left,
      y: e.clientY - canvas.getBoundingClientRect().top
    };
  }
}

function startDraw(e) {
  drawing = true;
  const pos = getPosition(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  const pos = getPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function drawTouch(e) {
  e.preventDefault();
  draw(e);
}

function stopDraw() {
  drawing = false;
}
function resetNote() {
  // Clear text
  document.getElementById("noteArea").value = "";

  // Clear canvas
  const canvas = document.getElementById("drawCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Optionally reset timer
  resetTimer();
}
