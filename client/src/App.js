import React, { Fragment, useEffect } from "react";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
// Redux
import { Provider } from "react-redux";
import store from "./store";
/* 
  We'd load user when component mounted, 
  but since we're using a functional component, we can't use the lifecycle method
  Instead, we're going to use useEffect provided by hooks
*/
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // useEffect: Functional component equivalent of componentDidMount in a class component
  // for it to run just once like componentDidMount, pass [] as the second argument
  useEffect (() => {
    store.dispatch(loadUser());
  }, []);
  return(
  <Provider store={store}>
    <Router>
      <Navbar></Navbar>
      <Route exact path="/" component={Landing}></Route>
      <section className="container">
        <Alert></Alert>
        <Switch>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/login" component={Login}></Route>
        </Switch>
      </section>
    </Router>
  </Provider>
)};

export default App;
