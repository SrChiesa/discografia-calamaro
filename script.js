

// =========================================================================
// 2. LÓGICA DEL REPRODUCTOR (No hace falta tocar nada aquí)
// =========================================================================
const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const volumeBar = document.getElementById("volume-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const vinylDisc = document.getElementById("vinyl-disc");

const currentCover = document.getElementById("current-cover");
const currentTitle = document.getElementById("current-title");
const currentAlbumBadge = document.getElementById("current-album-badge");

const albumsContainer = document.getElementById("albums-container");
const tracksContainer = document.getElementById("tracks-container");
const selectedAlbumTitle = document.getElementById("selected-album-title");
const selectedAlbumYear = document.getElementById("selected-album-year");

let currentAlbumIndex = 0; // Álbum que se está viendo en pantalla
let playingAlbumIndex = 0; // Álbum que está sonando actualmente
let playingTrackIndex = 0; // Canción que está sonando actualmente
let isPlaying = false;

// Inicializar la aplicación
function init() {
    renderAlbums();
    selectAlbum(0);
    loadTrack(0, 0, false);
    audio.volume = volumeBar.value;
}

// Dibujar tarjetas de álbumes
function renderAlbums() {
    albumsContainer.innerHTML = "";
    discografia.forEach((album, index) => {
        const card = document.createElement("div");
        card.className = `album-item ${index === currentAlbumIndex ? "active" : ""}`;
        card.innerHTML = `
            <img src="${album.portada}" alt="${album.titulo}" onerror="this.src='https://via.placeholder.com/150/18181c/d4af37?text=Calamaro'">
            <h4>${album.titulo}</h4>
            <span>${album.anio}</span>
        `;
        card.onclick = () => selectAlbum(index);
        albumsContainer.appendChild(card);
    });
}

// Seleccionar un álbum para ver su lista de temas
function selectAlbum(index) {
    currentAlbumIndex = index;
    renderAlbums();

    const album = discografia[index];
    selectedAlbumTitle.textContent = album.titulo;
    selectedAlbumYear.textContent = album.anio;

    tracksContainer.innerHTML = "";
    album.canciones.forEach((track, trackIdx) => {
        const li = document.createElement("li");
        const isCurrentSong = (playingAlbumIndex === index && playingTrackIndex === trackIdx);
        li.className = `track-row ${isCurrentSong ? "playing-now" : ""}`;
        li.innerHTML = `
            <div class="track-left">
                <span class="track-num">${isCurrentSong && isPlaying ? '<i class="fa-solid fa-volume-high"></i>' : trackIdx + 1}</span>
                <span>${track.titulo}</span>
            </div>
            <i class="fa-solid fa-play" style="font-size: 0.8rem; opacity: 0.6;"></i>
        `;
        li.onclick = () => loadTrack(index, trackIdx, true);
        tracksContainer.appendChild(li);
    });
}

// Cargar una canción en el reproductor
function loadTrack(albumIdx, trackIdx, autoPlay = true) {
    playingAlbumIndex = albumIdx;
    playingTrackIndex = trackIdx;

    const album = discografia[albumIdx];
    const track = album.canciones[trackIdx];

    audio.src = track.archivo;
    currentTitle.textContent = track.titulo;
    currentAlbumBadge.textContent = `${album.titulo} (${album.anio})`;
    currentCover.src = album.portada;
    currentCover.onerror = () => {
        currentCover.src = "https://via.placeholder.com/150/18181c/d4af37?text=Calamaro";
    };

    selectAlbum(currentAlbumIndex);

    if (autoPlay) {
        playAudio();
    }
}

function playAudio() {
    audio.play();
    isPlaying = true;
    playIcon.classList.replace("fa-play", "fa-pause");
    vinylDisc.classList.add("playing");
    selectAlbum(currentAlbumIndex);
}

function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playIcon.classList.replace("fa-pause", "fa-play");
    vinylDisc.classList.remove("playing");
    selectAlbum(currentAlbumIndex);
}

// Controles Play / Pause / Next / Prev
playBtn.addEventListener("click", () => {
    if (isPlaying) pauseAudio();
    else playAudio();
});

nextBtn.addEventListener("click", () => {
    const album = discografia[playingAlbumIndex];
    if (playingTrackIndex + 1 < album.canciones.length) {
        loadTrack(playingAlbumIndex, playingTrackIndex + 1, true);
    } else {
        // Si termina el disco, pasa al primer tema del siguiente disco
        const nextAlbum = (playingAlbumIndex + 1) % discografia.length;
        loadTrack(nextAlbum, 0, true);
    }
});

prevBtn.addEventListener("click", () => {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else if (playingTrackIndex - 1 >= 0) {
        loadTrack(playingAlbumIndex, playingTrackIndex - 1, true);
    }
});

// Pasar automáticamente al siguiente tema cuando termina uno
audio.addEventListener("ended", () => {
    nextBtn.click();
});

// Actualizar barra de progreso
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

progressBar.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value;
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}


init();
// =========================================================================
// LLUVIA AUTOMÁTICA DE TULIPANES (CON ESTILOS DIRECTOS)
// =========================================================================
const petalsContainer = document.getElementById("petals-container");

if (petalsContainer) {
    Object.assign(petalsContainer.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: "9999"
    });
}

function crearTulipan() {
    if (!petalsContainer) return;
    const tulip = document.createElement("span");
    tulip.textContent = "🌷";
    
    const duracion = Math.random() * 5 + 6; // entre 6 y 11 segundos
    const inicioX = Math.random() * 100;
    const derivaX = (Math.random() - 0.5) * 120; // se mueve suavemente hacia los lados

    Object.assign(tulip.style, {
        position: "fixed",
        top: "-40px",
        left: inicioX + "vw",
        fontSize: (Math.random() * 0.7 + 0.9) + "rem",
        pointerEvents: "none",
        userSelect: "none",
        filter: "drop-shadow(0 0 8px rgba(225, 29, 72, 0.65))"
    });

    petalsContainer.appendChild(tulip);

    const animacion = tulip.animate([
        { transform: "translate(0px, 0px) rotate(0deg)", opacity: 0.95 },
        { transform: `translate(${derivaX}px, 110vh) rotate(360deg)`, opacity: 0 }
    ], {
        duration: duracion * 1000,
        easing: "linear"
    });

    animacion.onfinish = () => tulip.remove();
}

setInterval(crearTulipan, 700);