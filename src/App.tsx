import React, { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("Welcome to ASO AI Agent!");

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>{message}</h1>
      <p>
        Edit <code>src/App.tsx</code> to start building your ASO Agent UI!
      </p>
    </div>
  );
}
