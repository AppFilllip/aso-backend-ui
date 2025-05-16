// ✅ STEP 2: Add Country Support to UI (React)
// Update your src/App.tsx file with this full version

import React, { useState } from "react";

export default function App() {
  const [appId, setAppId] = useState("");
  const [store, setStore] = useState("apple");
  const [country, setCountry] = useState("us");
  const [response, setResponse] = useState<any>(null);

  const handleAnalyze = async () => {
    const res = await fetch("https://aso-ai-backend.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: appId,
        app_store: store,
        country: country, // ✅ Send country as part of request if needed later
      }),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>
