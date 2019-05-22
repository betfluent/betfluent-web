import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import "./index.css";
import reducer from "./Application/Reducers";
import AppContainer from "./Application/Containers/AppContainer";
import HttpsRedirect from 'react-https-redirect'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunk)
));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <HttpsRedirect>
        <AppContainer />
      </HttpsRedirect>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
