import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import adress from "../scripts/apiAddress";
import "../css/login.css";
import BtnIcon from "../svg/btn-svg";
import {
  useTransition,
  animated,
  useChain,
  config,
  useSpring,
} from "react-spring";
import userEvent from "@testing-library/user-event";

function LoginPage(props) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    props.setBlur(loading);
  }, [loading]);

  useEffect(() => {
    var re = /\S+@\S+\.\S+/;
    if (email.length != 0 && !re.test(email)) {
      setEmailMsg("Please enter valid email");
    } else {
      setEmailMsg("");
    }
  }, [email]);
  useEffect(() => {
    if (password.length != 0 && password.length <= 6) {
      setPassMsg("Password is at least 6 characters");
    } else {
      setPassMsg("");
    }
  }, [password]);

  const handleSubmit = (e) => {
    if (loading) return;
    sendemail();
    e.preventDefault();
  };

  function sendemail() {
    if (
      (email.length <= 0) | (password.length <= 0) ||
      emailMsg != "" ||
      passMsg != ""
    ) {
      if (email.length <= 0) {
        setEmailMsg("Email cannot be blank");
      }
      if (password.length <= 0) {
        setPassMsg("Password cannot be blank");
      }
      return;
    }
    setLoading(true);
    axios
      .post(
        adress + "auth/login",
        {
          name: email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        props.setBlur("blur(0px)");
        if (response.data.message === "loggedin") {
          localStorage.setItem("token", response.data.token);
          props.successfulAuth(response.data.user);
        } else {
          setLoading(false);
          switch (response.data.message) {
            case "IE":
              setEmailMsg("Email is incorrect");
              break;
            case "IP":
              setPassMsg("Password is incorrect");
              console.log(passMsg);
              break;
          }
          console.log(response);
          if (passMsg == "") {
            console.log("SADASDASDs");
          }
        }
      })
      .catch((error) => console.log(error));
  }
  const [animFormUn1, setAnimFormUn1] = useSpring(() => ({
    top: "0px",
    fontSize: "16px",
  }));
  const [animFormUn2, setAnimFormUn2] = useSpring(() => ({
    top: "0px",
    fontSize: "16px",
  }));
  return (
    <div className="login-sub">
      <div className="user-box">
        <input
          id="email"
          className="user-box-input"
          autoComplete="new-password"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          onFocus={() => setAnimFormUn1({ top: "-20px", fontSize: "12px" })}
          onBlur={() => {
            if (email.length === 0)
              setAnimFormUn1({ top: "0px", fontSize: "16px" });
          }}
        />
        <animated.label style={animFormUn1} className="label">
          Username
        </animated.label>
        <div
          style={{ backgroundColor: emailMsg != "" ? "#FF0000" : "#808080" }}
          className="user-box-underline-off"
        >
          <div className="user-box-underline" />
          <p className="warn-message">{emailMsg}</p>
        </div>
      </div>
      <div className="user-box">
        <input
          className="user-box-input"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          required
          onFocus={() => setAnimFormUn2({ top: "-20px", fontSize: "12px" })}
          onBlur={() => {
            if (password.length === 0)
              setAnimFormUn2({ top: "0px", fontSize: "16px" });
          }}
        />
        <animated.label style={animFormUn2} className="label">
          Password
        </animated.label>
        <div
          style={{ backgroundColor: passMsg != "" ? "#FF0000" : "#808080" }}
          className="user-box-underline-off"
        >
          <div className="user-box-underline" />
        </div>
        <p className="warn-message">{passMsg}</p>
      </div>
      <button
        className="login-button-submit"
        type="submit"
        onClick={handleSubmit}
        style={{
          filter: emailMsg || passMsg ? "grayscale(1)" : "grayscale(0)",
        }}
      >
        <BtnIcon classa={"btn-icon"}></BtnIcon>
        <div className="btn-bckground"> Login</div>
        <BtnIcon classa={"btn-icon-down"}></BtnIcon>
      </button>
    </div>
  );
}

export default LoginPage;
