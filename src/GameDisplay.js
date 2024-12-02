import React from "react";
import PropTypes from "prop-types";

const GameDisplay = ({ gameResponse, currentPage, totalPages, onPageChange }) => {

  let parsedData = [];
  try {
    parsedData = gameResponse ? JSON.parse(gameResponse) : [];
  } catch {
    parsedData = [];
  }

  if (!Array.isArray(parsedData)) {
    return <div>Invalid data format</div>;
  }

  return (
    <div>
      <div className="table-container">
        <div className="table-header" >
          <div>User ID</div>
          <div>Game Name</div>
          <div>Behavior</div>
          <div>Value</div>
        </div>

        {parsedData.length > 0 ? (
          parsedData.map((entry, index) => (
            <div className="table-contents"
              key={index}>

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
  gameResponse: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default GameDisplay;
