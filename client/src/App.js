import React, { Fragment, useEffect } from "react";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import PrivateRoute from "./components/routing/PrivateRoute";
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
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Navbar></Navbar>
        <Route exact path="/" component={Landing}></Route>
        <section className="container">
          <Alert></Alert>
          <Switch>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/login" component={Login}></Route>
            {/* Our customized react-router-dom Route */}
            <PrivateRoute
              exact
              path="/dashboard"
              component={Dashboard}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path="/create-profile"
              component={CreateProfile}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path="/edit-profile"
              component={EditProfile}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path="/add-experience"
              component={AddExperience}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path="/add-education"
              component={AddEducation}
            ></PrivateRoute>
          </Switch>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
