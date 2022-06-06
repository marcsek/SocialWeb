import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import adress from "../scripts/apiAddress";
import "../css/profileFinder.css";
import { animated, useSpring } from "react-spring";
import BtnIcon from "../svg/btn-svg";
import SvgBtnLoad from "../svg/svg-btn-load";

function ProfileViewer(props) {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [alredyFriends, setAlreadyFriends] = useState(false);
  const [alredySent, setAlreadySent] = useState(false);

  const initialUserSearch = () => {
    axios
      .post(adress + "api/user/userFind", {
        id: id,
      })
      .then((response) => {
        setLoading(false);
        if (response.data === "DE") return;
        if (props.user.friends.find((e) => e == id)) {
          setAlreadyFriends(true);
        } else if (
          response.data.user.friendRequests.find((e) => e == props.user.id)
        ) {
          setAlreadySent(true);
          setRequestSendAnim({ left: "-3px", config: { duration: 0 } });
        }
        setUser({
          name: response.data.user.name,
          img: response.data.user.img,
          imgBack: response.data.user.imgBack,
          desc: response.data.desc,
        });
      });
  };
  useEffect(() => {
    let mouted = true;
    setBlurAnim({ backdropFilter: "blur(10px)", pointerEvents: "all" });
    if (
      mouted &&
      props.loogedInStatus === "LOGGED_IN" &&
      props.userLoading === "NO"
    ) {
      initialUserSearch();
      setTimeout(() => {
        setBlurAnim({ backdropFilter: "blur(0.06px)", pointerEvents: "none" });
      }, 100);
    }
    return () => (mouted = false);
  }, [props.userLoading]);

  const sendFriendRequest = () => {
    setRequestSendAnim({ left: "-3px" });
    axios
      .post(
        adress + "api/user/sendFriendRequest",
        { friend: id },
        { withCredentials: true }
      )
      .then((response) => {
        // setWaiting(false);
        console.log(response);
        if (response.data.message == "SUCC") {
        }
      });
  };

  const [blurAnim, setBlurAnim] = useSpring(() => ({
    backdropFilter: "blur(0.06px)",
    pointerEvents: "none",
    config: { duration: 100 },
  }));

  const [requestSendAnim, setRequestSendAnim] = useSpring(() => ({
    left: alredyFriends ? "-3px" : "-125px",
  }));

  return (
    <div className="main-background">
      <animated.div
        style={blurAnim}
        className="blurry-foreground"
      ></animated.div>
      <div className="img-back">
        <div className="img-foreground" />
        <img
          className="img-big"
          src={
            loading || !user.imgBack
              ? "/img/4k.jpg"
              : `data:image/gif;base64,${user.imgBack}`
          }
        ></img>
      </div>
      <div className="container-profile">
        <button
          className="send-friendr"
          style={{
            pointerEvents: alredySent ? "none" : "all",
            display: alredyFriends ? "none" : "block",
          }}
          onClick={() => sendFriendRequest()}
        >
          <div className="border-div">
            <animated.div className="btn-fore" style={requestSendAnim}>
              <SvgBtnLoad></SvgBtnLoad>
            </animated.div>
          </div>
          Add friend
        </button>

        <div
          className="buttonss"
          style={{ display: alredyFriends ? "block" : "none" }}
        >
          <button className="primary">Message</button>
          <button className="primary ghost">Following</button>
        </div>

        <div className="img_cont-profile">
          <img
            className="top11"
            src={
              loading || !user.img
                ? "/img/giphy.gif"
                : `data:image/gif;base64,${user.img}`
            }
          />
        </div>
        <h1 className="name-user">{loading ? "username" : user.name}</h1>
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
          <span className="profile-description-span">
            {loading || user.desc == null ? "No description" : user.desc}
          </span>
        </div>
        <span className="pro-tag">PRO</span>
      </div>
    </div>
  );
}
export default ProfileViewer;
