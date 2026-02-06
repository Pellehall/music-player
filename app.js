// NAVIGATION
const buttons = document.querySelectorAll(".sidebar nav button");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(btn.dataset.view).classList.add("active");

    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// MusicKit Init (lägg in din developer token här)
document.addEventListener("musickitloaded", async () => {
  const music = MusicKit.configure({
    developerToken: "DIN_DEVELOPER_TOKEN_HÄR",
    app: {
      name: "Music Platform",
      build: "1.0.0"
    }
  });

  await music.authorize();

  // Ladda rekommendationer
  loadRecommendations(music);

  // Sök
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", async e => {
    const query = e.target.value;
    if (query.length < 2) return;

    const results = await music.api.search(query, { types: ["songs", "albums"], limit: 8 });
    displaySearchResults(results);
  });
});

// RENDER REKOMMENDATIONER
function loadRecommendations(music) {
  // TODO: Anropa MusicKit API för rekommendationer
  // Temporär dummy-data för layout:
  const recommendations = [
    { name: "Album 1", artist: "Artist A", image: "https://via.placeholder.com/150" },
    { name: "Album 2", artist: "Artist B", image: "https://via.placeholder.com/150" },
    { name: "Album 3", artist: "Artist C", image: "https://via.placeholder.com/150" },
    { name: "Album 4", artist: "Artist D", image: "https://via.placeholder.com/150" }
  ];

  const container = document.getElementById("recommendations");
  container.innerHTML = "";
  recommendations.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="title">${item.name}</div>
      <div class="subtitle">${item.artist}</div>
      <div class="play-btn">▶</div>
    `;
    container.appendChild(card);
  });
}

// RENDER SÖKRESULTAT
function displaySearchResults(results) {
  const container = document.getElementById("searchResults");
  container.innerHTML = "";

  // Dummy om inget finns än
  if (!results.songs) return;

  results.songs.data.forEach(song => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${song.attributes.artwork.url.replace("{w}x{h}bb.jpg", "150x150bb.jpg")}" alt="${song.attributes.name}">
      <div class="title">${song.attributes.name}</div>
      <div class="subtitle">${song.attributes.artistName}</div>
      <div class="play-btn">▶</div>
    `;
    container.appendChild(card);
  });
}
