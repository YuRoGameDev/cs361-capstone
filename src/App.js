import React, { useState } from "react";

function App() {
  const [response, setResponse] = useState("");
  const [echoInput, setEchoInput] = useState("");

  const callApi = async (endpoint, method = "GET", body = null) => {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);
  
    try {
      const res = await fetch(endpoint, options); // No `/api` prefix
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.text(); // Expecting plain text
      setResponse(data);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };
  
  
  

  const handleEcho = () => {
    if (!echoInput.trim()) {
      setResponse("Please provide input to echo.");
      return;
    }
    callApi(`/echo?input=${encodeURIComponent(echoInput)}`);
  };

  return (
    <div>
      <h1>Server Commands</h1>

      <button onClick={() => callApi("/hello")}>Hello</button>
      <div>
        <label htmlFor="echo-input">Echo Contents:</label>
        <input
          type="text"
          id="echo-input"
          value={echoInput}
          onChange={(e) => setEchoInput(e.target.value)}
        />
        <button onClick={handleEcho}>Echo</button>
      </div>
      <button onClick={() => callApi("/error")}>Error</button>
      <button onClick={() => callApi("/games")}>Get Games</button>

      <button
        onClick={() =>
          callApi("/add-game", "POST", {
            user_id: 1,
            game_name: "Game1",
            behavior: "Playing",
            value: 100,
          })
        }
      >
        Add Game
      </button>
      <button
        onClick={() =>
          callApi("/update-game", "PUT", {
            user_id: 1,
            game_name: "Game1",
            behavior: "Playing",
            value: 200,
          })
        }
      >
        Update Game
      </button>
      <button
        onClick={() =>
          callApi("/delete-game", "DELETE", {
            user_id: 1,
            game_name: "Game1",
          })
        }
      >
        Delete Game
      </button>

      <pre>{response}</pre>
    </div>
  );
}

export default App;
