import React, { useState } from "react";

// Simple flag lookup
const COUNTRY_FLAGS: Record<string, string> = {
  us: "🇺🇸",
  in: "🇮🇳",
  gb: "🇬🇧",
  ca: "🇨🇦",
  au: "🇦🇺",
  de: "🇩🇪",
  fr: "🇫🇷",
  // add more if needed
};

export default function ASOAgentUI() {
  const [appId, setAppId] = useState("");
  const [store, setStore] = useState("apple");
  const [country, setCountry] = useState("us");
  const [analyzedApp, setAnalyzedApp] = useState<any>(null);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const API = "https://aso-ai-backend.onrender.com";

  const analyzeApp = async () => {
    setAnalyzedApp(null);
    const res = await fetch(`${API}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, app_store: store }),
    });
    const data = await res.json();
    setAnalyzedApp(data);
  };

  const getCompetitors = async () => {
    setCompetitors([]);
    const res = await fetch(`${API}/suggest-competitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, country }),
    });
    const data = await res.json();
    setCompetitors(data.competitors || []);
  };

  const getKeywords = async () => {
    setKeywords([]);
    const res = await fetch(`${API}/fetch-keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, country, competitors: selectedCompetitors }),
    });
    const data = await res.json();
    setKeywords(data.suggested_keywords || []);
  };

  const generateMetadata = async () => {
    setMetadata(null);
    const res = await fetch(`${API}/generate-metadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords }),
    });
    const data = await res.json();
    setMetadata(data.generated_metadata || data.status);
  };

  return (
    <div style={{ maxWidth: 520, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>ASO AI Agent</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="App ID (bundleId or package)"
          value={appId}
          onChange={e => setAppId(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select value={store} onChange={e => setStore(e.target.value)} style={{ padding: 8 }}>
          <option value="apple">Apple</option>
          <option value="google">Google</option>
        </select>
        <select value={country} onChange={e => setCountry(e.target.value)} style={{ padding: 8 }}>
          {Object.keys(COUNTRY_FLAGS).map(code =>
            <option value={code} key={code}>{COUNTRY_FLAGS[code]} {code.toUpperCase()}</option>
          )}
        </select>
        <button onClick={analyzeApp} style={{ padding: 8, background: "#2962ff", color: "#fff", border: "none", borderRadius: 4 }}>Analyze</button>
      </div>

      {analyzedApp && analyzedApp.title && (
        <div style={{
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          boxShadow: "0 2px 8px #eee",
          padding: 18,
          marginBottom: 20,
          background: "#fff",
          display: "flex",
          alignItems: "flex-start",
          gap: 16
        }}>
          <img
            src={analyzedApp.icon}
            alt="app icon"
            width={60}
            height={60}
            style={{ borderRadius: 14, border: "1px solid #eee" }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{analyzedApp.title}</div>
            <div style={{ color: "#3b3b3b", fontSize: 14 }}>{analyzedApp.developer}</div>
            <div style={{ margin: "6px 0" }}>
              <span style={{ fontSize: 18 }}>⭐</span>{" "}
              <span style={{ fontWeight: 600 }}>{analyzedApp.rating ? analyzedApp.rating.toFixed(2) : "N/A"}</span>
              {" · "}
              <span>{COUNTRY_FLAGS[country]} {country.toUpperCase()}</span>
            </div>
            <div style={{ color: "#454545", fontSize: 14, marginTop: 6 }}>
              {analyzedApp.description?.slice(0, 120)}...
            </div>
            <button onClick={getCompetitors} style={{ marginTop: 12, background: "#00bfae", color: "#fff", border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer" }}>
              Find Competitors
            </button>
          </div>
        </div>
      )}

      {competitors.length > 0 && (
        <div style={{ border: "1px solid #cfd8dc", padding: 16, borderRadius: 8, background: "#f8fafd", marginBottom: 20 }}>
          <b>Select Competitors:</b>
          <div>
            {competitors.map(c => (
              <label key={c.id} style={{ display: "block", margin: "7px 0" }}>
                <input
                  type="checkbox"
                  checked={selectedCompetitors.includes(c.id)}
                  onChange={e => {
                    const checked = e.target.checked;
                    setSelectedCompetitors(prev => checked ? [...prev, c.id] : prev.filter(id => id !== c.id));
                  }}
                  style={{ marginRight: 7 }}
                />
                {c.name} <span style={{ color: "#888" }}>({c.id})</span>
              </label>
            ))}
          </div>
          <button
            onClick={getKeywords}
            disabled={selectedCompetitors.length === 0}
            style={{ marginTop: 14, background: "#ff7043", color: "#fff", border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer" }}
          >
            Suggest Keywords
          </button>
        </div>
      )}

      {keywords.length > 0 && (
        <div style={{ border: "1px solid #ffe082", background: "#fffde7", padding: 16, borderRadius: 8, marginBottom: 20 }}>
          <b>Suggested Keywords:</b>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, margin: "12px 0" }}>
            {keywords.map((k, i) =>
              <span key={i} style={{
                background: "#fff9c4",
                border: "1px solid #ffe082",
                borderRadius: 14,
                padding: "4px 12px",
                fontSize: 13
              }}>{k}</span>
            )}
          </div>
          <button
            onClick={generateMetadata}
            style={{ background: "#7c4dff", color: "#fff", border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer" }}>
            Generate Metadata
          </button>
        </div>
      )}

      {metadata && (
        <div style={{ border: "1px solid #b3e5fc", background: "#e1f5fe", padding: 16, borderRadius: 8, marginTop: 18 }}>
          <b>Generated Metadata:</b>
          <div style={{ whiteSpace: "pre-line", marginTop: 8, fontFamily: "monospace", color: "#222" }}>
            {typeof metadata === "string" ? metadata : JSON.stringify(metadata, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
}
