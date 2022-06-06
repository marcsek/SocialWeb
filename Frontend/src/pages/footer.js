import "../css/footer.css";
// import React, { Component } from "react";
// import axios from "axios";
import adress from "../scripts/apiAddress";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function Footer() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (message === "") return;
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setMessage("");
      timeoutRef.current = null;
    }, 5000);
  }, [message]);

  const sendEmail = () => {
    console.log(localStorage.getItem("token"));
    if (!ready) return;
    setReady(false);
    axios
      .post(adress + "api/newsletter", user)
      .then((res) => {
        console.log(res);

        if (res.data == "inuse") {
          setMessage("Email sa uz pouziva");
        } else if (res.data == "registered") {
          setMessage("Email bol zaregistrovany");
        } else if (res.data.loggedIn == false) {
          setMessage("Log in first");
        } else {
          setMessage(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setReady(true);
    }, 5000);
  };

  return (
    <div className="footer">
      <div className="heading a">
        <h2>About</h2>
        <a href="#">Zaco</a>
      </div>
      <div className="heading b">
        <h2>Contact</h2>
        <a href="#">Preco</a>
      </div>
      <div className="heading c">
        <h2>Work</h2>
        <a href="#">Aha</a>
      </div>
      <div className="footer-form">
        <h2>Joing our newsletter</h2>
        <input
          type="email"
          placeholder="Enter your email"
          id="footer-email"
          onChange={(e) => setUser({ email: e.target.value })}
        ></input>
        <button id="footer-email-btn" onClick={sendEmail}>
          Sign Up
        </button>
        <p className="warning">
          <small>{message}</small>
        </p>
      </div>
    </div>
  );
}

export default Footer;
