import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import adress from "../scripts/apiAddress";
import "../css/register.css";
import BtnIcon from "../svg/btn-svg";
import {
  useTransition,
  animated,
  useChain,
  config,
  useSpring,
  interpolate,
} from "react-spring";

function ReagistratioPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.setBlur(loading);
  }, [loading]);

  useEffect(() => {
    if (name.length != 0 && name.length < 6) {
      setNameMsg("Name is too short");
    } else {
      setNameMsg("");
    }
  }, [name]);
  useEffect(() => {
    var re = /\S+@\S+\.\S+/;
    if (email.length != 0 && !re.test(email)) {
      setEmailMsg("Please enter valid email");
    } else {
      setEmailMsg("");
    }
  }, [email]);
  useEffect(() => {
    if (pass.length != 0 && pass.length <= 6) {
      setPassMsg("Password too short");
    } else {
      setPassMsg("");
    }
  }, [pass]);

  const handleSubmit = (e) => {
    if (loading) return;
    sendReg();
    e.preventDefault();
  };

  function sendReg() {
    if (
      (name.length <= 0) | (email.length <= 0) | (pass.length <= 0) ||
      nameMsg != "" ||
      emailMsg != "" ||
      passMsg != ""
    ) {
      if (name.length <= 0) {
        setNameMsg("Name cannost be blank");
      }
      if (email.length <= 0) {
        setEmailMsg("Email cannot be blank");
      }
      if (pass.length <= 0) {
        setPassMsg("Password cannot be blank");
      }
      return;
    }
    //https://backend-app-jk.herokuapp.com/api/user/register
    setLoading(true);
    setMessage("");

    axios
      .post(
        adress + "auth/register",
        {
          password: pass,
          name: name,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          console.log(response.data)
          localStorage.setItem("token", response.data.token);
        } else {
          setLoading(false);
          if (response.data.message == "IU") {
            setEmailMsg("Email alredy in use");
          }
          console.log(response);
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
  const [animFormUn3, setAnimFormUn3] = useSpring(() => ({
    top: "0px",
    fontSize: "16px",
  }));
  return (
    <div className="register-sub">
      <div className="user-box">
        <input
          className="user-box-input"
          autoComplete="new-password"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setAnimFormUn1({ top: "-20px", fontSize: "12px" })}
          onBlur={() => {
            if (name.length === 0)
              setAnimFormUn1({ top: "0px", fontSize: "16px" });
          }}
          required
        />
        <animated.label style={animFormUn1} className="label">
          Username
        </animated.label>
        <div
          style={{ backgroundColor: nameMsg != "" ? "#FF0000" : "#808080" }}
          className="user-box-underline-off"
        >
          <div className="user-box-underline" />
        </div>
        <p className="warn-message">{nameMsg}</p>
      </div>
      <div className="user-box">
        <input
          className="user-box-input"
          autoComplete="new-password"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setAnimFormUn2({ top: "-20px", fontSize: "12px" })}
          onBlur={() => {
            if (email.length === 0)
              setAnimFormUn2({ top: "0px", fontSize: "16px" });
          }}
          required
        />
        <animated.label style={animFormUn2} className="label">
          Email
        </animated.label>
        <div
          style={{ backgroundColor: emailMsg != "" ? "#FF0000" : "#808080" }}
          className="user-box-underline-off"
        >
          <div className="user-box-underline" />
        </div>
        <p className="warn-message">{emailMsg}</p>
      </div>
      <div className="user-box">
        <input
          className="user-box-input"
          autoComplete="new-password"
          type="password"
          name="pass"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onFocus={() => setAnimFormUn3({ top: "-20px", fontSize: "12px" })}
          onBlur={() => {
            if (pass.length === 0)
              setAnimFormUn3({ top: "0px", fontSize: "16px" });
          }}
          required
        />
        <animated.label style={animFormUn3} className="label">
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
      <animated.button
        className="login-button-submit"
        type="submit"
        onClick={handleSubmit}
        style={{
          filter:
            nameMsg || emailMsg || passMsg ? "grayscale(1)" : "grayscale(0)",
        }}
      >
        <BtnIcon classa={"btn-icon"}></BtnIcon>
        <div className="btn-bckground">Register</div>
        <BtnIcon classa={"btn-icon-down"}></BtnIcon>
      </animated.button>
      {loading ? <h6>Loading</h6> : <h6></h6>}
      <h6>{message}</h6>
    </div>
  );
}

export default ReagistratioPage;
