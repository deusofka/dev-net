import React, { useEffect } from "react";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Routes from "./components/routing/Routes";
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
  // Like componentDidMount, this'll be called after all components and subcomponents finish rendering
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route component={Routes}></Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
