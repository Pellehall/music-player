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

// REKOMMENDATIONER (dummy-data som start)
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

// SÖK MED iTunes API
document.getElementById("searchInput").addEventListener("input", async e => {
  const query = e.target.value;
  if (query.length < 2) return;

  const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album,song&limit=12`);
  const data = await response.json();

  const grid = document.getElementById("searchResults");
  grid.innerHTML = "";

  data.results.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.artworkUrl100.replace("100x100", "200x200")}" alt="${item.collectionName || item.trackName}">
      <div class="title">${item.collectionName || item.trackName}</div>
      <div class="subtitle">${item.artistName}</div>
      <div class="play-btn">▶</div>
    `;
    grid.appendChild(card);
  });
});
