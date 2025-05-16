
const root = document.getElementById("root");

root.innerHTML = `
  <div style="padding: 2rem; font-family: Arial">
    <h1>🚀 ASO AI Agent</h1>
    <input id="appId" placeholder="Enter App ID" style="margin-right: 1rem;" />
    <select id="store">
      <option value="apple">Apple</option>
      <option value="google">Google</option>
    </select>
    <select id="country" style="margin-left: 1rem;">
      <option value="us">🇺🇸 US</option>
      <option value="in">🇮🇳 India</option>
      <option value="gb">🇬🇧 UK</option>
      <option value="ca">🇨🇦 Canada</option>
      <option value="de">🇩🇪 Germany</option>
      <option value="fr">🇫🇷 France</option>
    </select>
    <button id="analyzeBtn" style="margin-left: 1rem;">Analyze</button>
    <div id="result" style="margin-top: 2rem;"></div>
    <div id="competitorSection" style="margin-top: 2rem;"></div>
  </div>
`;

let selectedCompetitors = [];

document.getElementById("analyzeBtn").onclick = async () => {
  const appId = document.getElementById("appId").value;
  const store = document.getElementById("store").value;
  const country = document.getElementById("country").value;
  const resultBox = document.getElementById("result");
  const competitorBox = document.getElementById("competitorSection");
  resultBox.innerHTML = "⏳ Loading...";
  competitorBox.innerHTML = "";

  const res = await fetch("https://aso-ai-backend.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_store: store, country }),
  });

  const data = await res.json();
  resultBox.innerHTML = `
    <h2>📱 App Info</h2>
    <p><strong>Title:</strong> ${data.title || "N/A"}</p>
    <p><strong>Developer:</strong> ${data.developer || "N/A"}</p>
    <p><strong>Rating:</strong> ${data.rating || "N/A"}</p>
    <p><strong>Description:</strong> ${data.description?.slice(0, 200) || "N/A"}...</p>
    <img src="${data.icon}" alt="icon" style="width:100px;margin-top:1rem;" />
    <br/><button id="fetchCompetitors" style="margin-top: 1rem;">Suggest Competitors</button>
  `;

  document.getElementById("fetchCompetitors").onclick = async () => {
    const compRes = await fetch("https://aso-ai-backend.onrender.com/suggest-competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, country }),
    });
    const compData = await compRes.json();
    const competitors = compData.competitors || [];
    competitorBox.innerHTML = `<h3>🧠 Select Competitors</h3>` + competitors.map(c => `
      <label style="display:block; margin-bottom:5px;">
        <input type="checkbox" value="${c.id}" onchange="toggleCompetitor('${c.id}')"/> ${c.name} (${c.id})
      </label>
    `).join("");
  };
};

window.toggleCompetitor = (id) => {
  if (selectedCompetitors.includes(id)) {
    selectedCompetitors = selectedCompetitors.filter(cid => cid !== id);
  } else {
    selectedCompetitors.push(id);
  }
};
