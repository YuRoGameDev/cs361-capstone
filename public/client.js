"use strict";
(function () {
  window.addEventListener("load", init);
  function init() {
    document.getElementById("echo-btn").addEventListener("click", requestEcho);
  }

  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

  function requestEcho() {
    const contents = document.getElementById("what-to-echo").value;
    fetch("echo?input=" + contents)
      .then(checkStatus)
      .then(resp => resp.text())
      .then(resp => {
        document.getElementById("echoed").textContent = resp;
      })
      .catch(console.error);
  }
})();