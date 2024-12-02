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
    getId: "",
    getName: "",
  });

  const handleGameChange = (e) => {
    const { id, value } = e.target;
    setGameData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    callGameApi(newPage);
  };

  useEffect(() => {
    callGameApi(currentPage);
  }, [currentPage]);


  const callGameApi = async (page = 1) => {

    const endpoint = "/games";
    const body = {
      userId: formGameData.getId,
      gameName: formGameData.getName,
      limit: 50,
      offset: (page - 1) * 50,
    };


    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };


    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => {
        return value && String(value).trim() !== "";
      })
    );


    const queryParams = new URLSearchParams(filteredBody).toString();
    const fullEndpoint = queryParams ? `${endpoint}?${queryParams}` : endpoint;

    console.log("Request URL:", fullEndpoint);

    try {
      const res = await fetch(fullEndpoint, options);
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      setGameResponse(data.data);
      setTotalPages(Math.ceil(data.total / 50));
    } catch (error) {
      setGameResponse(`Error: ${error.message}`);
    }
  };
  //#endregion

  //#region  Game Add
  const [formAddData, setAddData] = useState({
    addId: "",
    addName: "",
    addPurchaseValue: "0",
    addPlayValue: "0",
  });

  const handleAddChange = (e) => {
    const { id, value } = e.target;
    setAddData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDropdownAddChange = (column) => {
    setAddData(prevData => ({
      ...prevData,
      addPurchaseValue: column.target.value
    }));
  };

  const callAddApi = async (endpoint, method = "POST", body = null) => {
    if (!formAddData.addId || !formAddData.addName) {
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
        if (formAddData.addPurchaseValue === "1") {
          setResponse(`Added UserID: ${formAddData.addId}, GameName: ${formAddData.addName}, 
            Purchase Status: Bought, Hours Played: ${formAddData.addPlayValue}`);
        } else {
          setResponse(`Added UserID: ${formAddData.addId}, GameName: ${formAddData.addName}, Purchase Status: Not Bought`);
        }
      }

    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };
  //#endregion

  //#region  Game Delete
  const [formDeleteData, setDeleteData] = useState({
    deleteId: "",
    deleteName: "",
  });

  const handleDeleteChange = (e) => {
    const { id, value } = e.target;
    setDeleteData((prev) => ({ ...prev, [id]: value }));
  };

  const callDeleteApi = async (endpoint, method = "DELETE", body = null) => {
    if (!formDeleteData.deleteId || !formDeleteData.deleteName) {
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
        setResponse(`Deleted Record of UserID: ${formDeleteData.deleteId} and GameName: ${formDeleteData.deleteName}`);
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
        <h3>Filter Records</h3>
        <InputField
          type="number"
          label="User ID"
          id="getId"
          value={formGameData.getId}
          onChange={handleGameChange}
        />

        <InputField
          label="Game Name"
          id="getName"
          value={formGameData.getName}
          onChange={handleGameChange}
        />

        <button onClick={() => callGameApi(currentPage)}>
          Get Records
        </button>

      </div>


      <GameDisplay
        gameResponse={JSON.stringify(gameResponse)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <footer>
        {/* Game Add */}
        <div>
          <h3>Add Record</h3>
          <InputField
            type="number"
            label="User ID"
            id="addId"
            value={formAddData.addId}
            onChange={handleAddChange}
          />
          <InputField
            label="Game Name"
            id="addName"
            value={formAddData.addName}
            onChange={handleAddChange}
          />

          <div className="dropdown">
            <label htmlFor="dropdownAddChange">Purchase Status</label>
            <select id="dropdownAddChange" onChange={handleDropdownAddChange}>
              <option value="0">Not Purchased</option>
              <option value="1">Purchased</option>
            </select>
          </div>

          {formAddData.addPurchaseValue === '1' && (
            <InputField
              type="number"
              label="Hours Played"
              id="addPlayValue"
              value={formAddData.addPlayValue}
              onChange={handleAddChange}
            />
          )}

          <button
            onClick={() => {
              callAddApi("/add-game", "POST", {
                user_id: formAddData.addId,
                game_name: formAddData.addName,
                behavior: "purchase",
                value: formAddData.addPurchaseValue,
              });
              callAddApi("/add-game", "POST", {
                user_id: formAddData.addId,
                game_name: formAddData.addName,
                behavior: "play",
                value: formAddData.addPlayValue,
              });
            }}
          >
            Add Record
          </button>
        </div>

        {/* Game Update */}
        <div>
          <h3>Update Record</h3>
          <InputField
            type="number"
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

          <div className="dropdown">
            <label htmlFor="dropdownUpdateChange">Purchase Status</label>
            <select id="dropdownUpdateChange" onChange={handleDropdownUpdateChange}>
              <option value="0">Not Purchased</option>
              <option value="1">Purchased</option>
            </select>
          </div>

          {formUpdateData.purchaseValue === '1' && (
            <InputField
              type="number"
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
            Update Record
          </button>
        </div>

        {/* Game Delete */}
        <div>
          <h3>Delete Record</h3>
          <InputField
            type="number"
            label="User ID"
            id="deleteId"
            value={formDeleteData.deleteId}
            onChange={handleDeleteChange}
          />

          <InputField
            label="Game Name"
            id="deleteName"
            value={formDeleteData.deleteName}
            onChange={handleDeleteChange}
          />

          <button
            onClick={() =>
              callDeleteApi("/delete-game", "DELETE", {
                user_id: formDeleteData.deleteId,
                game_name: formDeleteData.deleteName,
              })
            }
          >
            Delete Record
          </button>

        </div>

        <pre>{response}</pre>

      </footer>

      

    </div>
  );
}

export default App;
