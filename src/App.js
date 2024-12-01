import React, { useState } from "react";
import InputField from "./InputField";

function App() {
  const [response, setResponse] = useState("");
  const [gameResponse, setGameResponse] = useState("");

  const [formGameData, setGameData] = useState({
    input1: "",
    input2: "",
  });

  const [formAddData, setAddData] = useState({
    input1: "",
    input2: "",
    behavior: "purchase",
    value: "0",

  });
  const [isDropdownUpdate, setIsDropdownUpdate] = useState(false);

  const handleDropdownChange = (column) => {
    setAddData(prevData => ({
      ...prevData,
      behavior: column.target.value
    }));
  };
  const handleDropdownValueChange = (column) => {
    setAddData(prevData => ({
      ...prevData,
      value: column.target.value
    }));
  };

  const callGameApi = async (endpoint, method = "GET", body = null) => {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    // Remove empty fields from the query parameters
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value.trim() !== "")
    );
    const queryParams = new URLSearchParams(filteredBody).toString();
    endpoint += queryParams ? `?${queryParams}` : ""; // Append query only if it exists

    console.log("Request URL:", endpoint);

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
            userId: formGameData.input1,
            gameName: formGameData.input2,
          })}>Get Games</button>
        </div>


        <div>
          <InputField
            label="Input 1"
            id="input1"
            value={formGameData.input1}
            onChange={handleChange}
          />
          <InputField
            label="Input 1"
            id="input1"
            value={formGameData.input1}
            onChange={handleChange}
          />
          <select onChange={handleDropdownChange}>
            <option value="purchase">Purchased</option>
            <option value="play">Hours Played</option>

          </select>

          {formAddData.behavior === 'play' && (
            <InputField
              label="Input 1"
              id="input1"
              value={formGameData.input1}
              onChange={handleChange}
            />
          )}

          {formAddData.behavior === 'purchase' && (
            <select onChange={handleDropdownValueChange}>
              <option value="0">Not Purchased</option>
              <option value="1">Purchased</option>
            </select>
          )}

        </div>
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
