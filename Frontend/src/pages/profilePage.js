import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import adress from "../scripts/apiAddress";
import "../css/userProfile.css";
import { animated, useSpring } from "react-spring";

function ProfilePage(props) {
  const [selectedFile1, setSelectedFile1] = useState("");
  const [selectedFile2, setSelectedFile2] = useState("");
  const [editing, setEditing] = useState(false);
  const [edName, setEdName] = useState("");
  const [edDesc, setEdDesc] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [descMsg, setDescMsg] = useState("");

  useEffect(() => {
    if (props.loogedInStatus !== "LOGGED_IN" && props.userLoading === "NO") {
      props.history.push("/userpage");
    }
  });
  useEffect(() => {
    let mouted = true;
    setBlurAnim({ backdropFilter: "blur(10px)", pointerEvents: "all" });
    if (
      mouted &&
      props.loogedInStatus === "LOGGED_IN" &&
      props.userLoading === "NO"
    ) {
      setEdName(props.user.name);
      setEdDesc(props.user.desc);
      setTimeout(() => {
        setBlurAnim({ backdropFilter: "blur(0.06px)", pointerEvents: "none" });
      }, 200);
    }
    return () => (mouted = false);
  }, [props.userLoading]);
  const data = new FormData();

  useEffect(() => {
    if (!editing) return;
    if (edName.length <= 0) {
      setNameMsg("Name is too short");
    } else if (edName >= 20) {
      setNameMsg("Name is too long");
    } else {
      setNameMsg("");
    }
  }, [edName]);
  useEffect(() => {
    if (!editing) return;
    if (edDesc.length >= 100) {
      setDescMsg("Description is too long");
    } else {
      setDescMsg("");
    }
  }, [edDesc]);

  const sendChanges = () => {
    if (
      !editing ||
      nameMsg ||
      descMsg ||
      (edName == props.user.name &&
        edDesc == props.user.desc &&
        !selectedFile1 &&
        !selectedFile2)
    )
      return;
    let type = "";
    if (selectedFile2) type += "p";
    if (selectedFile1) type += "b";

    data.append("name", edName);
    data.append("desc", edDesc);
    data.append("files", selectedFile1);
    data.append("files", selectedFile2);
    data.append("type", type);
    axios.post(adress + "api/user/fromdata", data).then(() => {
      props.checkLoginStatus();
    });
  };
  const [blurAnim, setBlurAnim] = useSpring(() => ({
    backdropFilter: "blur(0.06px)",
    pointerEvents: "none",
    config: { duration: 100 },
  }));

  return (
    <div className="main-background">
      <animated.div
        style={blurAnim}
        className="blurry-foreground"
      ></animated.div>
      <div className="img-back">
        <input
          id="file-input-big"
          type="file"
          onChange={(e) => setSelectedFile1(e.target.files[0])}
        />
        <label
          className="form-btn"
          htmlFor="file-input-big"
          style={{ display: !editing ? "none" : "block" }}
        >
          Change background
        </label>
        <div className="img-foreground" />
        <img
          className="img-big"
          src={
            (props.userLoading === "YES" &&
              props.loogedInStatus == "NOT_LOGGED_IN") ||
            !props.user.imgBack
              ? "/img/4k.jpg"
              : `data:image/gif;base64,${props.user.imgBack}`
          }
        ></img>
      </div>
      <div className="container-profile">
        <button
          style={
            nameMsg || descMsg
              ? {
                  color: "#FF0000",
                  border: "1px solid #FF0000",
                  cursor: "default",
                }
              : null
          }
          className="edit-profile"
          onClick={
            !nameMsg && !descMsg
              ? () => {
                  sendChanges();
                  setEditing(!editing);
                }
              : null
          }
        >
          {!editing ? "EDIT" : "SAVE"}
        </button>
        <div className="img_cont-profile">
          <label htmlFor={editing ? "file-input" : null}>
            <img
              className="top11"
              src={
                (props.userLoading === "YES" &&
                  props.loogedInStatus === "NOT_LOGGED_IN") ||
                !props.user.img
                  ? "/img/giphy.gif"
                  : `data:image/gif;base64,${props.user.img}`
              }
            />
            <p
              className="image_overlay_pro"
              style={{ display: editing ? "block" : "none" }}
            >
              change
            </p>
          </label>
        </div>
        <input
          id="file-input"
          type="file"
          onChange={(e) => setSelectedFile2(e.target.files[0])}
        />
        {editing && props.userLoading !== "YES" ? (
          <div>
            <input
              className="name-user-edit"
              value={edName}
              onChange={(e) => setEdName(e.target.value)}
            ></input>
            <p className="warning">{nameMsg}</p>
          </div>
        ) : (
          <h1 className="name-user">
            {props.userLoading === "YES" &&
            props.loogedInStatus === "NOT_LOGGED_IN"
              ? "username"
              : props.user.name}
          </h1>
        )}
        <div className="profile-stats">
          <div>
            <span className="number">12</span>
            <span className="desc">projects</span>
          </div>
          <div>
            <span className="number">3</span>
            <span className="desc">languages used</span>
          </div>
          <div>
            <span className="number">108</span>
            <span className="desc">letters</span>
          </div>
        </div>
        <div className="devider"></div>
        <div className="profile-description">
          {editing && props.userLoading !== "YES" ? (
            <div>
              <textarea
                value={edDesc}
                onChange={(e) => setEdDesc(e.target.value)}
              ></textarea>
              <p className="warning">{descMsg}</p>
            </div>
          ) : (
            <span className="profile-description-span">
              {(props.userLoading === "YES" &&
                props.loogedInStatus === "NOT_LOGGED_IN") ||
              props.user.desc == ""
                ? "No description"
                : props.user.desc}
            </span>
          )}
        </div>
        <span className="pro-tag">PRO</span>
      </div>
    </div>
  );
}
export default ProfilePage;
