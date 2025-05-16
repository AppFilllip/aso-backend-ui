// Minimal React App, compiled for production

import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [appId, setAppId] = React.useState("");
  const [store, setStore] = React.useState("apple");
  const [country, setCountry] = React.useState("us");
  const [analyzedApp, setAnalyzedApp] = React.useState(null);
  const [competitors, setCompetitors] = React.useState([]);
  const [selectedCompetitors, setSelectedCompetitors] = React.useState([]);
  const [keywords, setKeywords] = React.useState([]);
  const [metadata, setMetadata] = React.useState(null);

  const API = "https://aso-ai-backend.onrender.com";

  const analyzeApp = async () => {
    setAnalyzedApp(null);
    const res = await fetch(`${API}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, app_store: store }),
    });
    setAnalyzedApp(await res.json());
  };

  const getCompetitors = async () => {
    const res = await fetch(`${API}/suggest-competitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, country }),
    });
    const data = await res.json();
    setCompetitors(data.competitors || []);
  };

  const getKeywords = async () => {
    const res = await fetch(`${API}/fetch-keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, country, competitors: selectedCompetitors }),
    });
    const data = await res.json();
    setKeywords(data.suggested_keywords || []);
  };

  const generateMetadata = async () => {
    const res = await fetch(`${API}/generate-metadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords }),
    });
    const data = await res.json();
    setMetadata(data.generated_metadata || data.status);
  };

  return React.createElement(
    "div",
    { style: { maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "Inter,sans-serif" } },
    React.createElement("h1", null, "ASO AI Agent"),
    React.createElement(
      "div",
      { style: { marginBottom: 16 } },
      React.createElement("input", {
        placeholder: "App ID / Bundle ID",
        value: appId,
        onChange: (e) => setAppId(e.target.value),
        style: { marginRight: 8, padding: 6 }
      }),
      React.createElement("select", {
        value: store,
        onChange: (e) => setStore(e.target.value),
        style: { marginRight: 8 }
      }, [
        React.createElement("option", { value: "apple", key: "apple" }, "Apple"),
        React.createElement("option", { value: "google", key: "google" }, "Google")
      ]),
      React.createElement("select", {
        value: country,
        onChange: (e) => setCountry(e.target.value),
        style: { marginRight: 8 }
      }, [
        React.createElement("option", { value: "us", key: "us" }, "🇺🇸 US"),
        React.createElement("option", { value: "in", key: "in" }, "🇮🇳 India"),
        React.createElement("option", { value: "gb", key: "gb" }, "🇬🇧 UK"),
        React.createElement("option", { value: "de", key: "de" }, "🇩🇪 Germany"),
        React.createElement("option", { value: "fr", key: "fr" }, "🇫🇷 France"),
        React.createElement("option", { value: "jp", key: "jp" }, "🇯🇵 Japan")
      ]),
      React.createElement("button", { onClick: analyzeApp, style: { padding: "6px 16px" } }, "Analyze")
    ),
    analyzedApp && React.createElement(
      "div",
      { style: { background: "#f9f9f9", borderRadius: 12, padding: 18, marginBottom: 18, border: "1px solid #eaeaea" } },
      analyzedApp.icon && React.createElement("img", { src: analyzedApp.icon, alt: "", width: 60, style: { borderRadius: 8 } }),
      React.createElement("h2", { style: { margin: "12px 0 4px" } }, analyzedApp.title),
      React.createElement("div", { style: { fontSize: 15, color: "#333", marginBottom: 5 } },
        analyzedApp.developer, " | ⭐ ", analyzedApp.rating
      ),
      React.createElement("p", { style: { fontSize: 13, color: "#444" } },
        analyzedApp.description ? analyzedApp.description.slice(0, 200) + "..." : null
      ),
      React.createElement("button", { onClick: getCompetitors, style: { marginTop: 10, padding: "6px 16px" } }, "Find Competitors")
    ),
    competitors.length > 0 && React.createElement(
      "div",
      { style: { marginBottom: 18 } },
      React.createElement("div", { style: { marginBottom: 7, fontWeight: 500 } }, "Select Competitors:"),
      competitors.map((c) =>
        React.createElement("label", { key: c.id, style: { display: "block", marginBottom: 4 } },
          React.createElement("input", {
            type: "checkbox",
            checked: selectedCompetitors.includes(c.id),
            onChange: (e) => {
              const checked = e.target.checked;
              setSelectedCompetitors((prev) =>
                checked ? [...prev, c.id] : prev.filter((id) => id !== c.id)
              );
            },
            style: { marginRight: 6 }
          }),
          c.name, " (", c.id, ")"
        )
      ),
      React.createElement("button", { onClick: getKeywords, style: { marginTop: 8, padding: "6px 16px" } }, "Suggest Keywords")
    ),
    keywords.length > 0 && React.createElement(
      "div",
      { style: { marginBottom: 18 } },
      React.createElement("div", { style: { marginBottom: 7, fontWeight: 500 } }, "Suggested Keywords:"),
      React.createElement(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
        keywords.map((k, i) =>
          React.createElement("div", {
            key: k,
            style: { background: "#e1f5fe", color: "#026aa7", borderRadius: 16, padding: "4px 12px", fontSize: 13 }
          }, k)
        )
      ),
      React.createElement("button", { onClick: generateMetadata, style: { marginTop: 8, padding: "6px 16px" } }, "Generate Metadata")
    ),
    metadata && React.createElement(
      "div",
      { style: { background: "#f0fff0", border: "1px solid #c7efd9", borderRadius: 10, padding: 14, marginBottom: 14 } },
      React.createElement("div", { style: { fontWeight: 500, marginBottom: 6 } }, "Generated Metadata:"),
      React.createElement("pre", { style: { fontSize: 13, lineHeight: 1.5, margin: 0 } }, JSON.stringify(metadata, null, 2))
    )
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(React.createElement(App));
}
