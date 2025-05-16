// ✅ STEP 3: Add Competitor Suggestion to Frontend
// This builds on top of Step 2 (with country)

import React, { useState } from "react";

export default function App() {
  const [appId, setAppId] = useState("");
  const [store, setStore] = useState("apple");
  const [country, setCountry] = useState("us");
  const [response, setResponse] = useState<any>(null);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);

  const API = "https://aso-ai-backend.onrender.com";

  const handleAnalyze = async () => {
    const res = await fetch(`${API}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, app_store: store, country }),
    });
    const data = await res.json();
    setResponse(data);
  };

  const fetchCompetitors = async () => {
    const res = await fetch(`${API}/suggest-competitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, country }),
    });
    const data = await res.json();
    setCompetitors(data.competitors || []);
  };

  const toggleCompetitor = (id: string) => {
    setSelectedCompetitors(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>
