import React, { useState } from "react";

export default function App() {
  const [appId, setAppId] = useState("");
  const [store, setStore] = useState("apple");
  const [response, setResponse] = useState<any>(null);

  const handleAnalyze = async () => {
    const res = await fetch("https://aso-ai-backend.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: appId,
        app_store: store,
      }),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🚀 ASO AI Agent</h1>

      <input
        style={{ marginRight: "1rem" }}
        value={appId}
        onChange={(e) => setAppId(e.target.value)}
        placeholder="Enter App ID (e.g., com.spotify.music)"
      />
      <select value={store} onChange={(e) => setStore(e.target.value)}>
        <option value="apple">Apple</option>
        <option value="google">Google</option>
      </select>

      <button onClick={handleAnalyze} style={{ marginLeft: "1rem" }}>
        Analyze
      </button>

      {response && (
        <div style={{ marginTop: "2rem", padding: "1rem", background: "#f1f1f1" }}>
          <h2>📱 App Info</h2>
          <p><strong>App ID:</strong> {response.app_id}</p>
          <p><strong>Store:</strong> {response.store}</p>
          <p><strong>Title:</strong> {response.title}</p>
          <p><strong>Developer:</strong> {response.developer}</p>
          <p><strong>Rating:</strong> {response.rating}</p>
          <p><strong>Description:</strong><br /> {response.description?.slice(0, 300)}...</p>
          <img src={response.icon} alt="icon" style={{ marginTop: "1rem", width: 100 }} />
        </div>
      )}
    </div>
  );
}
