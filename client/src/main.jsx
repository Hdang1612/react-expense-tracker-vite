import { Provider } from "react-redux";

import ReactDOM from "react-dom/client";
import "./index.css";
import "../src/component/transaction_item/styleDropdown.css";
import App from "./App";
import store from "./feature/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <ToastContainer />
    <App />
  </Provider>,
);
