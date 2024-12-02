import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import GameDisplay from "./GameDisplay";

function App() {
  const [response, setResponse] = useState("");
 
  //#region Game Get
  const [gameResponse, setGameResponse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [formGameData, setGameData] = useState({
    id: "",
    name: "",
  });

  const handleGameChange = (e) => {
    const { id, value } = e.target;
    setGameData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    callGameApi(newPage); // Fetch data for the new page
  };

  useEffect(() => {
    callGameApi(currentPage); // Fetch data for the current page when the component mounts or currentPage changes
}, [currentPage]);

//endpoint, method = "GET", body = null
  const callGameApi = async (page = 1) => {
    const limit = 50;
    const offset = (page - 1) * limit;
    
    // const options = {
    //   method,
    //   headers: { "Content-Type": "application/json" },
    // };

    // const filteredBody = Object.fromEntries(
    //   Object.entries(body).filter(([_, value]) => value.trim() !== "")
    // );

    const filteredBody = {
      userId: formGameData.id,
      gameName: formGameData.name,
      limit: limit,
      offset: offset,
    };
    
    const queryParams = new URLSearchParams(filteredBody).toString();
    const endpoint = `/games?${queryParams}`; 
    //endpoint += queryParams ? `?${queryParams}` : "";

    console.log("Request URL:", endpoint);

    try {
      //, options
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.text();
      setGameResponse(data.data);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (error) {
      setGameResponse(`Error: ${error.message}`);
    }
  };
  //#endregion

  //#region  Game Add
  const [formAddData, setAddData] = useState({
    id: "",
    name: "",
    purchaseValue: "0",
    playValue: "0",
  });

  const handleAddChange = (e) => {
    const { id, value } = e.target;
    setAddData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDropdownAddChange = (column) => {
    setAddData(prevData => ({
      ...prevData,
      purchaseValue: column.target.value
    }));
  };

  const callAddApi = async (endpoint, method = "POST", body = null) => {
    if (!formAddData.id || !formAddData.name) {
      setResponse("User ID and Name cannot be empty.");
      return;
    }

    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    try {
      const res = await fetch(endpoint, options);
      if (!res.ok) { throw new Error(`Error: ${res.statusText}`) }
      else {
        const data = await res.text();
        if (formAddData.purchaseValue === "1") {
          setResponse(`Added UserID: ${formAddData.id}, GameName: ${formAddData.name}, Purchase Status: Bought, Hours Played: ${formAddData.playValue}`);
        } else {
          setResponse(`Added UserID: ${formAddData.id}, GameName: ${formAddData.name}, Purchase Status: Not Bought`);
        }
      }

    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };
  //#endregion

  //#region  Game Delete
  const [formDeleteData, setDeleteData] = useState({
    id: "",
    name: "",
  });

  const handleDeleteChange = (e) => {
    const { id, value } = e.target;
    setDeleteData((prev) => ({ ...prev, [id]: value }));
  };

  const callDeleteApi = async (endpoint, method = "DELETE", body = null) => {
    if (!formDeleteData.id || !formDeleteData.name) {
      setResponse("User ID and Name cannot be empty.");
      return;
    }

    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    try {
      const res = await fetch(endpoint, options);
      if (!res.ok) { throw new Error(`Error: ${res.statusText}`) }
      else {
        const data = await res.text();
        setResponse(data);
      }

    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };
  //#endregion

  //#region  Game Update
  const [formUpdateData, setUpdateData] = useState({
    id: "",
    name: "",
    purchaseValue: "0",
    playValue: "0",
  });

  const handleUpdateChange = (e) => {
    const { id, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDropdownUpdateChange = (column) => {
    setUpdateData(prevData => ({
      ...prevData,
      purchaseValue: column.target.value
    }));
  };

  const callUpdateApi = async (endpoint, method = "GET", body = null) => {
    if (!formUpdateData.id || !formUpdateData.name) {
      setResponse("User ID and Name cannot be empty.");
      return;
    }

    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    try {
      const res = await fetch(endpoint, options);
      if (!res.ok) { throw new Error(`Error: ${res.statusText}`) }
      else {
        const data = await res.text();
        if (formUpdateData.purchaseValue === "1") {
          setResponse(`Updated UserID: ${formUpdateData.id}, GameName: ${formUpdateData.name}, Purchase Status: Bought, Hours Played: ${formUpdateData.playValue}`);
        } else {
          setResponse(`Updated UserID: ${formUpdateData.id}, GameName: ${formUpdateData.name}, Purchase Status: Not Bought`);
        }
      }

    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };
  //#endregion


  return (
    <div>
      {/* Game Get */}
      <div style={{ gap: "20px", padding: "20px" }}>
        <InputField
          label="User ID"
          id="id"
          value={formGameData.id}
          onChange={handleGameChange}
        />

        <InputField
          label="Game Name"
          id="name"
          value={formGameData.name}
          onChange={handleGameChange}
        />

<button onClick={() => callGameApi(currentPage)}>
          Get Games
        </button>

        {/* <button onClick={() => callGameApi("/games", "GET", {
          userId: formGameData.id,
          gameName: formGameData.name,
        })}>Get Games</button> */}
      </div>

      {/* <GameDisplay gameResponse={gameResponse}/> */}

      <GameDisplay
        gameResponse={JSON.stringify(gameResponse)} // Pass the game data as JSON string
        currentPage={currentPage} // Pass current page to the display component
        totalPages={totalPages} // Pass total pages to the display component
        onPageChange={handlePageChange} // Pass the page change handler to GameDisplay
      />

      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {/* Game Add */}
        <div>
          <InputField
            label="User ID"
            id="id"
            value={formAddData.id}
            onChange={handleAddChange}
          />
          <InputField
            label="Game Name"
            id="name"
            value={formAddData.name}
            onChange={handleAddChange}
          />

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="dropdownAddChange" style={{ display: "block" }}>Purchase Status</label>
            <select id="dropdownAddChange" onChange={handleDropdownAddChange}>
              <option value="0">Not Purchased</option>
              <option value="1">Purchased</option>
            </select>
          </div>

          {formAddData.purchaseValue === '1' && (
            <InputField
              label="Hours Played"
              id="playValue"
              value={formAddData.playValue}
              onChange={handleAddChange}
            />
          )}

          <button
            onClick={() => {
              callAddApi("/add-game", "POST", {
                user_id: formAddData.id,
                game_name: formAddData.name,
                behavior: "purchase",
                value: formAddData.purchaseValue,
              });
              callAddApi("/add-game", "POST", {
                user_id: formAddData.id,
                game_name: formAddData.name,
                behavior: "play",
                value: formAddData.playValue,
              });
            }}
          >
            Add Game
          </button>
        </div>

        {/* Game Update */}
        <div>
          <InputField
            label="User ID"
            id="id"
            value={formUpdateData.id}
            onChange={handleUpdateChange}
          />
          <InputField
            label="Game Name"
            id="name"
            value={formUpdateData.name}
            onChange={handleUpdateChange}
          />

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="dropdownUpdateChange" style={{ display: "block" }}>Purchase Status</label>
            <select id="dropdownUpdateChange" onChange={handleDropdownUpdateChange}>
              <option value="0">Not Purchased</option>
              <option value="1">Purchased</option>
            </select>
          </div>

          {formUpdateData.purchaseValue === '1' && (
            <InputField
              label="Hours Played"
              id="playValue"
              value={formUpdateData.playValue}
              onChange={handleUpdateChange}
            />
          )}

          <button
            onClick={() => {
              callUpdateApi("/update-game", "PUT", {
                user_id: formUpdateData.id,
                game_name: formUpdateData.name,
                behavior: "purchase",
                value: formUpdateData.purchaseValue,
              });
              callUpdateApi("/update-game", "PUT", {
                user_id: formUpdateData.id,
                game_name: formUpdateData.name,
                behavior: "play",
                value: formUpdateData.playValue,
              });
            }}
          >
            Update Game
          </button>
        </div>

        {/* Game Delete */}
        <div>
          <InputField
            label="User ID"
            id="id"
            value={formDeleteData.id}
            onChange={handleDeleteChange}
          />

          <InputField
            label="Game Name"
            id="name"
            value={formDeleteData.name}
            onChange={handleDeleteChange}
          />

          <button
            onClick={() =>
              callDeleteApi("/delete-game", "DELETE", {
                user_id: formDeleteData.id,
                game_name: formDeleteData.name,
              })
            }
          >
            Delete Game
          </button>

        </div>

      </div>
      
      <pre>{response}</pre>

    </div>
  );
}

export default App;
