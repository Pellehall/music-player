// Navigation (hierarkisk + kontextuell)
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(btn.dataset.view).classList.add("active");
  });
});

// Apple Music / MusicKit
document.addEventListener("musickitloaded", async () => {
  const music = MusicKit.configure({
    developerToken: "DIN_DEVELOPER_TOKEN_HÄR",
    app: {
      name: "Music Platform",
      build: "1.0.0"
    }
  });

  await music.authorize();

  // Rekommendationer (personalisering)
  const recommendations = await music.api.music(
    "v1/me/recommendations"
  );

  const container = document.getElementById("recommendations");

  recommendations.data[0].relationships.contents.data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${item.attributes.name}</strong>
      <p>${item.attributes.curatorName || ""}</p>
    `;
    container.appendChild(card);
  });
});

// Sök (dynamiskt, adaptivt UI)
document.getElementById("searchInput").addEventListener("input", async e => {
  const query = e.target.value;
  if (query.length < 2) return;

  const music = MusicKit.getInstance();
  const results = await music.api.search(query, {
    types: ["songs", "albums"],
    limit: 8
  });

  const grid = document.getElementById("searchResults");
  grid.innerHTML = "";

  results.songs.data.forEach(song => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = song.attributes.name;
    grid.appendChild(card);
  });
});
