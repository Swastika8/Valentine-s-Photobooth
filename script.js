const video = document.getElementById("video");
const timerEl = document.getElementById("timer");
const flashEl = document.getElementById("flash");
const filterSelect = document.getElementById("filter");
const photoCountSelect = document.getElementById("photoCount");
const snapBtn = document.getElementById("snapBtn");
const reelCanvas = document.getElementById("reelCanvas");

let photos = [];

// Floating Hearts
setInterval(() => {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = ["💖", "💗", "❤️", "💕", "💘"][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 20 + 20 + "px";
    heart.style.animationDuration = Math.random() * 3 + 5 + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
}, 300);

async function startLove(){
    document.getElementById("landing").style.display = "none";
    document.getElementById("cameraPage").style.display = "flex";
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "user", // Front camera
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        });
        video.srcObject = stream;
    } catch (err) {
        alert("Camera error! Please check permissions.");
    }
}

filterSelect.addEventListener("change", () => {
    video.style.filter = filterSelect.value;
});

async function startReelSequence() {
    photos = [];
    snapBtn.disabled = true;
    reelCanvas.style.display = "none";
    const count = parseInt(photoCountSelect.value);

    for (let i = 0; i < count; i++) {
        await runCountdown(3);
        triggerFlash();
        captureFrame();
        // 1 second pause to change poses
        await new Promise(res => setTimeout(res, 1000));
    }
    renderReel();
    snapBtn.disabled = false;
}

function runCountdown(seconds) {
    return new Promise(resolve => {
        let count = seconds;
        timerEl.style.display = "block";
        timerEl.innerText = count;
        const interval = setInterval(() => {
            count--;
            if (count <= 0) {
                clearInterval(interval);
                timerEl.style.display = "none";
                resolve();
            } else { timerEl.innerText = count; }
        }, 1000);
    });
}

function triggerFlash() {
    flashEl.classList.remove("flash-active");
    void flashEl.offsetWidth; 
    flashEl.classList.add("flash-active");
}

function captureFrame() {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const ctx = tempCanvas.getContext("2d");
    ctx.filter = filterSelect.value;
    ctx.drawImage(video, 0, 0);
    photos.push(tempCanvas);
}

function renderReel() {
    const imgW = 400; 
    const imgH = (photos[0].height / photos[0].width) * imgW;
    const pad = 40;
    const space = 20;

    reelCanvas.width = imgW + (pad * 2);
    reelCanvas.height = (imgH * photos.length) + (space * (photos.length - 1)) + (pad * 2) + 60;
    const ctx = reelCanvas.getContext("2d");

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, reelCanvas.width, reelCanvas.height);

    // Film Sprockets
    ctx.fillStyle = "#333";
    for (let y = 10; y < reelCanvas.height; y += 30) {
        ctx.fillRect(10, y, 15, 15);
        ctx.fillRect(reelCanvas.width - 25, y, 15, 15);
    }

    photos.forEach((p, i) => {
        ctx.drawImage(p, pad, pad + (i * (imgH + space)), imgW, imgH);
    });

    ctx.fillStyle = "#ff4d6d";
    ctx.font = "bold 22px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("VALENTINE 2026❤️", reelCanvas.width/2, reelCanvas.height-30);
    
    reelCanvas.style.display = "block";
    reelCanvas.scrollIntoView({ behavior: 'smooth' });
}

function discardReel() {
    photos = [];
    reelCanvas.style.display = "none";
}

function downloadReel() {
    if (photos.length === 0) return;
    const link = document.createElement("a");
    link.download = "love-reel.png";
    link.href = reelCanvas.toDataURL();
    link.click();
}
