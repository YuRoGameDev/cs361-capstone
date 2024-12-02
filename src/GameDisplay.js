import React from "react";
import PropTypes from "prop-types";

const GameDisplay = ({ gameResponse, currentPage, totalPages, onPageChange }) => {
  const parsedData = (() => {
    try {
      return JSON.parse(gameResponse); // Parse JSON if valid
    } catch {
      return []; // Return empty array if parsing fails
    }
  })();

  return (
    <div>
      <div
        style={{
          border: "1px solid #ccc",
          maxHeight: "300px",
          overflowY: "scroll",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr 2fr 1fr",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          <div>User ID</div>
          <div>Game Name</div>
          <div>Behavior</div>
          <div>Value</div>
        </div>

        {parsedData.length > 0 ? (
          parsedData.map((entry, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 3fr 2fr 1fr",
                padding: "5px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>{entry.user_id}</div>
              <div>{entry.game_name}</div>
              <div>{entry.behavior}</div>
              <div>{entry.value}</div>
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

// Prop validation
GameDisplay.propTypes = {
  gameResponse: PropTypes.string.isRequired, // The response should be a JSON string
  currentPage: PropTypes.number.isRequired, // Current page for pagination
  totalPages: PropTypes.number.isRequired, // Total number of pages
  onPageChange: PropTypes.func.isRequired, // Function to handle page change
};

export default GameDisplay;
