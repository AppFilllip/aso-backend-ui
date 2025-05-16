(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const l=document.getElementById("root");l.innerHTML=`
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
`;document.getElementById("analyzeBtn").onclick=async()=>{var t;const s=document.getElementById("appId").value,o=document.getElementById("store").value,n=document.getElementById("result");n.innerHTML="⏳ Loading...";const e=await(await fetch("https://aso-ai-backend.onrender.com/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({app_id:s,app_store:o})})).json();n.innerHTML=`
    <h2>📱 App Info</h2>
    <p><strong>Title:</strong> ${e.title||"N/A"}</p>
    <p><strong>Developer:</strong> ${e.developer||"N/A"}</p>
    <p><strong>Rating:</strong> ${e.rating||"N/A"}</p>
    <p><strong>Description:</strong> ${((t=e.description)==null?void 0:t.slice(0,200))||"N/A"}...</p>
    <img src="${e.icon}" alt="icon" style="width:100px;margin-top:1rem;" />
  `};
