
const root = document.getElementById("root");

root.innerHTML = `
  <div class="container">
    <h1>🚀 ASO AI Agent</h1>
    <div class="controls">
      <input id="appId" placeholder="Enter App ID" />
      <select id="store">
        <option value="apple">Apple</option>
        <option value="google">Google</option>
      </select>
      <select id="country">
        <option value="us">🇺🇸 US</option>
        <option value="in">🇮🇳 India</option>
        <option value="gb">🇬🇧 UK</option>
        <option value="ca">🇨🇦 Canada</option>
        <option value="de">🇩🇪 Germany</option>
        <option value="fr">🇫🇷 France</option>
      </select>
      <button id="analyzeBtn">Analyze</button>
    </div>
    <div id="loading" class="loading">⏳ Please wait...</div>
    <div id="result" class="card"></div>
    <div id="competitorSection" class="competitor-list"></div>
  </div>
`;

let selectedCompetitors = [];

document.getElementById("loading").style.display = "none";

document.getElementById("analyzeBtn").onclick = async () => {
  const appId = document.getElementById("appId").value;
  const store = document.getElementById("store").value;
  const country = document.getElementById("country").value;
  const resultBox = document.getElementById("result");
  const competitorBox = document.getElementById("competitorSection");
  const loading = document.getElementById("loading");

  resultBox.innerHTML = "";
  competitorBox.innerHTML = "";
  loading.style.display = "block";

  const res = await fetch("https://aso-ai-backend.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_store: store, country }),
  });

  const data = await res.json();
  loading.style.display = "none";
  resultBox.innerHTML = `
    <h2>📱 ${data.title}</h2>
    <p><strong>Developer:</strong> ${data.developer || "N/A"}</p>
    <p><strong>Rating:</strong> ⭐ ${data.rating || "N/A"}</p>
    <p>${data.description?.slice(0, 200) || "N/A"}...</p>
    <img src="${data.icon}" alt="icon" />
    <button id="fetchCompetitors">Suggest Competitors</button>
  `;

  document.getElementById("fetchCompetitors").onclick = async () => {
    competitorBox.innerHTML = "<p>⏳ Finding competitors...</p>";
    const compRes = await fetch("https://aso-ai-backend.onrender.com/suggest-competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, country }),
    });
    const compData = await compRes.json();
    const competitors = compData.competitors || [];
    competitorBox.innerHTML = "<h3>🧠 Select Competitors</h3>" +
      competitors.map(c => `
        <div class="competitor-card" onclick="toggleCompetitor('${c.id}', this)">
          <input type="checkbox" value="${c.id}" hidden />
          <strong>${c.name}</strong> <span>(${c.id})</span>
        </div>
      `).join("");
  };
};

window.toggleCompetitor = (id, el) => {
  el.classList.toggle("selected");
  if (selectedCompetitors.includes(id)) {
    selectedCompetitors = selectedCompetitors.filter(cid => cid !== id);
  } else {
    selectedCompetitors.push(id);
  }
};
