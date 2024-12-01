import React, { useState } from "react";
import InputField from "./InputField";

function App() {
  const [response, setResponse] = useState("");
  const [echoInput, setEchoInput] = useState("");

  const [formGameData, setGameData] = useState({
    input1: "",
    input2: "",
  });
  const [gameResponse, setGameResponse] = useState("");
  const callGameApi = async (endpoint, method = "GET", body = null) => {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    try {
      const res = await fetch(endpoint, options); // No `/api` prefix
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.text(); // Expecting plain text
      setGameResponse(data);
    } catch (error) {
      setGameResponse(`Error: ${error.message}`);
    }
  };


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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setGameData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div>
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <div>

        <InputField
          label="Input 1"
          id="input1"
          value={formGameData.input1}
          onChange={handleChange}
        />

        <InputField
          label="Input 2"
          id="input2"
          value={formGameData.input2}
          onChange={handleChange}
        />

        <button onClick={() => callGameApi("/games", "GET", {
          userID: formGameData.input1,
          gameName: formGameData.input2,
        })}>Get Games</button>
      </div>

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

      
    </div>
    <pre>{response}</pre>
    <pre>{gameResponse}</pre>
    </div>
  );
}

export default App;
