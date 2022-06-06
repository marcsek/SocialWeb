import React, { useState, useEffect } from "react";
import "../css/navbar.css";
import Icon from "../svg/svg.js";
import { Link } from "react-router-dom";
import Logout from "../scripts/logoutScript";
import { FiBox, FiUser, FiUsers, FiLogOut } from "react-icons/fi";
import {
  useTransition,
  animated,
  useChain,
  config,
  useSpring,
} from "react-spring";

function Navbar(props) {
  const [click, setClick] = useState(true);
  const [over, setOver] = useState(false);
  const handleLogout = () => {
    Logout(props.handleLogout);
  };

  const animateNav = useSpring({
    height: click ? "4vh" : "70vh",
    borderRadius: click ? "5rem" : "1rem",
  });
  const animatedSvg = useSpring({
    transform: click ? "rotateX(0deg)" : "rotateX(180deg)",
  });

  return (
    <animated.div style={animateNav} className="navbar">
      <animated.div
        onMouseOver={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
        className="logo"
        style={animatedSvg}
        onClick={() => setClick(!click)}
      >
        {/* <Link to="/"></Link> */}
        <Icon click={click} />
      </animated.div>
      <ul className="nav-links">
        <li className="nav-list-el">
          <Link to="/" className="link">
            <FiBox />
          </Link>
          <h6>Index</h6>
        </li>
        <li className="nav-list-el">
          <Link to="/" className="link">
            <FiUsers />
          </Link>
          <h6>Friends</h6>
        </li>
        {props.loggedIn == "NOT_LOGGED_IN" ? (
          <li className="nav-list-el">
            <Link to="/" className="link">
              <FiUsers />
            </Link>
            <h6>Friends</h6>
          </li>
        ) : (
          <li className="nav-list-el">
            <Link to="/friends" className="link">
              <FiUser />
            </Link>
            <h6>Friends</h6>
          </li>
        )}
        {props.loggedIn == "NOT_LOGGED_IN" ? (
          <li className="nav-list-el">
            <Link to="/userpage" className="link">
              <FiUser />
            </Link>
            <h6>Login</h6>
          </li>
        ) : (
          <li className="nav-list-el">
            <Link to="/" className="link" onClick={handleLogout}>
              <FiLogOut />
            </Link>
            <h6>Logout</h6>
          </li>
        )}
      </ul>
      <div className="profile-pic-nav">
        <Link to="/profile"></Link>
        <img
          src={
            props.loggedIn === "LOGGED_IN" && props.userLoading === "NO"
              ? `data:image/gif;base64,${props.user.img}`
              : "/img/giphy.gif"
          }
        />
      </div>
    </animated.div>
  );
}
export default Navbar;
