import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import StartPage from "./pages/startpage";
import Nav from "./pages/navbar";
import UserPage from "./pages/userPage";
import Footer from "./pages/footer";
import error from "./pages/pagenotfound";
import ProfilePage from "./pages/profilePage";
import ProfileViewer from "./pages/profileViewer";
import FriendPage from "./pages/friendPage";
import Test from "./pages/test";
import Messages from "./pages/messages";

import adress from "./scripts/apiAddress";

import "./css/app.css";

function App() {
  const [logInStatus, setLogInStatus] = useState("NOT_LOGGEN_IN");
  const [userLoading, setUserLoading] = useState("YES");
  const [user, setUser] = useState({});
  const header = useRef(null);

  useEffect(() => {
    handleHeader();
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    handleHeader();
    checkLoginStatus();
  };

  const handleLogout = () => {
    localStorage.clear();
    handleHeader();
    checkLoginStatus();
  };

  const handleHeader = () => {
    if (!localStorage.getItem("token")) {
      axios.interceptors.request.eject(header.current);
    } else {
      header.current = axios.interceptors.request.use(
        (config) => {
          config.headers.authtoken = localStorage.getItem("token");
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );
    }
  };

  const checkLoginStatus = () => {
    setUserLoading("YES");
    console.log("token " + localStorage.getItem("token"));
    axios
      .get(adress + "auth/checkToken", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Cau " + response.status);
        if (response.data.loggedIn) {
          setLogInStatus("LOGGED_IN");
          setUser(response.data.user);
          setUserLoading("NO");
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setLogInStatus("NOT_LOGGED_IN");
          setUser({});
          setUserLoading("NO");
        }
      });
  };

  return (
    <Router>
      <div className="container-main">
        {/* <Test></Test> */}
        <Nav className="na" user={user} userLoading={userLoading} loggedIn={logInStatus} handleLogout={handleLogout} />
        {/* <Test></Test> */}

        {/* <Footer className="fo" /> */}
        <Switch>
          <Route path="/" exact render={(props) => <StartPage {...props} handleLogin={handleLogin} loogedInStatus={logInStatus} user={user} />} />
          <Route
            path="/userpage"
            exact
            render={(props) => (
              <UserPage
                {...props}
                handleLogin={handleLogin}
                loogedInStatus={logInStatus}
                handleLogout={handleLogout}
                // history={rHistory}
              />
            )}
          />
          <Route
            path="/profile"
            exact
            render={(props) => (
              <ProfilePage {...props} loogedInStatus={logInStatus} user={user} checkLoginStatus={checkLoginStatus} userLoading={userLoading} />
            )}
          />
          <Route
            path="/profileFind/:id"
            exact
            render={(props) => (
              <ProfileViewer {...props} loogedInStatus={logInStatus} user={user} checkLoginStatus={checkLoginStatus} userLoading={userLoading} />
            )}
          />
          <Route
            path="/friends"
            exact
            render={(props) => (
              <FriendPage {...props} loogedInStatus={logInStatus} user={user} checkLoginStatus={checkLoginStatus} userLoading={userLoading} />
            )}
          />
          <Route
            path="/messages"
            exact
            render={(props) => (
              <Messages {...props} loogedInStatus={logInStatus} user={user} checkLoginStatus={checkLoginStatus} userLoading={userLoading}></Messages>
            )}
          />
          <Route path="/" component={error} />
        </Switch>
        <Footer className="fo" />
      </div>
    </Router>
  );
}
export default App;
