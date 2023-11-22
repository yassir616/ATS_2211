import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import { unregister as unregisterServiceWorker } from "./registerServiceWorker";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Router basename={"/takafulapp"}>
    <App />
  </Router>,
  document.getElementById("root")
);

unregisterServiceWorker();
