import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [model, setModel] = useState("gpt-5-pro");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, model }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response || "No response received.");
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Query Frontend</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <textarea
          rows="4"
          cols="50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query..."
          required
        />
        <br />

        <label style={{ marginRight: "0.5rem" }}>
          Choose model:
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="gpt-5-pro">GPT-5 Pro</option>
            <option value="gpt-5-thinking">GPT-5 Thinking</option>
            <option value="gemini-pro">Gemini Pro</option>
            <option value="gemini-deep-think">Gemini Deep Think</option>
          </select>
        </label>
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Query"}
        </button>
      </form>

      <h2>Response:</h2>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "1rem",
          borderRadius: "4px",
          whiteSpace: "pre-wrap",
        }}
      >
        {response}
      </pre>
    </div>
  );
}

export default App;
