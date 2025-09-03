import { useState } from "react";

function App() {
  const [model, setModel] = useState("gpt-5-pro");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const sendRequest = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt }),
      });

      const data = await res.json();
      setResponse(data.output || data.error || "No response received.");
    } catch (err) {
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">LLM Playground</h1>

      <label className="block mb-2 font-semibold">Choose Model:</label>
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="border rounded p-2 mb-4 w-full"
      >
        <option value="gpt-5-pro">GPT-5 Pro</option>
        <option value="gpt-5-thinking">GPT-5 Thinking</option>
        <option value="gemini-pro">Gemini Pro</option>
        <option value="gemini-deepthink">Gemini DeepThink</option>
      </select>

      <label className="block mb-2 font-semibold">Enter Prompt:</label>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={5}
        placeholder="Ask me anything..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={sendRequest}
        disabled={loading}
      >
        {loading ? "Loading..." : "Send"}
      </button>

      <div className="mt-6 p-4 border rounded bg-gray-50 min-h-[100px]">
        <h2 className="font-semibold mb-2">Response:</h2>
        <pre className="whitespace-pre-wrap">{response}</pre>
      </div>
    </div>
  );
}

export default App;
