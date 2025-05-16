
const root = document.getElementById("root");

root.innerHTML = `
  <div style="padding: 2rem; font-family: Arial">
    <h1>🚀 ASO AI Agent</h1>
    <input id="appId" placeholder="Enter App ID" style="margin-right: 1rem;" />
    <select id="store">
      <option value="apple">Apple</option>
      <option value="google">Google</option>
    </select>
    <button id="analyzeBtn" style="margin-left: 1rem;">Analyze</button>
    <div id="result" style="margin-top: 2rem;"></div>
  </div>
`;

document.getElementById("analyzeBtn").onclick = async () => {
  const appId = document.getElementById("appId").value;
  const store = document.getElementById("store").value;
  const resultBox = document.getElementById("result");
  resultBox.innerHTML = "⏳ Loading...";

  const res = await fetch("https://aso-ai-backend.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_store: store })
  });

  const data = await res.json();
  resultBox.innerHTML = `
    <h2>📱 App Info</h2>
    <p><strong>Title:</strong> ${data.title || "N/A"}</p>
    <p><strong>Developer:</strong> ${data.developer || "N/A"}</p>
    <p><strong>Rating:</strong> ${data.rating || "N/A"}</p>
    <p><strong>Description:</strong> ${data.description?.slice(0, 200) || "N/A"}...</p>
    <img src="${data.icon}" alt="icon" style="width:100px;margin-top:1rem;" />
  `;
};
