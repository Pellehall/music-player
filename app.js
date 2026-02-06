// Navigation
const buttons = document.querySelectorAll(".sidebar nav button");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(btn.dataset.view).classList.add("active");

    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Dummy rekommendationer för startvyn
const recommendations = [
  { name: "Album 1", artist: "Artist A", image: "https://via.placeholder.com/150" },
  { name: "Album 2", artist: "Artist B", image: "https://via.placeholder.com/150" },
  { name: "Album 3", artist: "Artist C", image: "https://via.placeholder.com/150" },
  { name: "Album 4", artist: "Artist D", image: "https://via.placeholder.com/150" }
];

const recContainer = document.getElementById("recommendations");
recommendations.forEach(item => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <div class="title">${item.name}</div>
    <div class="subtitle">${item.artist}</div>
    <div class="play-btn">▶</div>
  `;
  recContainer.appendChild(card);
});

// Hantera sökning med iTunes API
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", async e => {
  const query = e.target.value.trim();
  if (query.length < 2) {
    searchResults.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album,song&limit=12`);
    const data = await response.json();

    searchResults.innerHTML = "";

    data.results.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.artworkUrl100.replace("100x100", "200x200")}" alt="${item.collectionName || item.trackName}">
        <div class="title">${item.collectionName || item.trackName}</div>
        <div class="subtitle">${item.artistName}</div>
        <div class="play-btn">▶</div>
      `;

      // Lägg till play-funktion för previewUrl om det finns
      const playBtn = card.querySelector(".play-btn");
      if (item.previewUrl) {
        playBtn.style.cursor = "pointer";
        playBtn.addEventListener("click", e => {
          e.stopPropagation();
          playPreview(item.previewUrl);
        });
      } else {
        playBtn.style.opacity = "0.3";
        playBtn.style.cursor = "default";
      }

      searchResults.appendChild(card);
    });
  } catch (error) {
    console.error("Sökfel:", error);
    searchResults.innerHTML = "<p>Fel vid sökning. Försök igen senare.</p>";
  }
});

// Audio playback (för preview)
let currentAudio = null;

function playPreview(url) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  currentAudio = new Audio(url);
  currentAudio.play().catch(() => {
    alert("Kunde inte spela upp ljudet.");
  });
}
