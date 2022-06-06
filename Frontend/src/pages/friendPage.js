import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import adress from "../scripts/apiAddress";
import "../css/friendsPage.css";
import { easeCubicIn } from "d3-ease";
import { useTransition, animated, useChain, config, useSpring } from "react-spring";

function FriendPage(props) {
  const [ID, setID] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendsRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState("");
  const [animGoing, setanimGoing] = useState(true);
  const [animGoing2, setanimGoing2] = useState(true);
  const [textFocused, setTextFocused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (props.loogedInStatus !== "LOGGED_IN" && props.userLoading === "NO") {
      props.history.push("/userpage");
    }
  });

  useEffect(() => {
    let mouted = true;
    if (mouted && props.loogedInStatus === "LOGGED_IN" && props.userLoading === "NO") {
      getFriends();
      getFriendRequests();
    }
    return () => (mouted = false);
  }, [props.userLoading]);

  const timeOutMessage = (message) => {
    setMessage(message);
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setMessage("");
      timeoutRef.current = null;
    }, 5000);
  };
  const add = () => {
    // setTog(!tog);
    // setFriends([
    //   ...friends,
    //   { user: { name: "adada", id: Math.floor(Math.random() * 1000), img: "asdasdad" } },
    // ]);
    setFriends(friends.slice(1));
    // setFriends(friends.slice(1));
    // setFriendsRequests([
    //   ...friends,
    //   { user: { name: "adada", id: "adada", img: "asdasdad" } },
    // ]);
  };

  const sendFriendRequest = () => {
    if (waiting) return;
    setMessage("sending");
    setWaiting(true);
    axios.post(adress + "api/user/sendFriendRequest", { friend: ID }, { withCredentials: true }).then((response) => {
      setWaiting(false);
      switch (response.data.message) {
        case "DE":
          timeOutMessage("Could not find user");
          break;
        case "AF":
          timeOutMessage("You are alredy friends with this user");
          break;
        case "AS":
          timeOutMessage("You have alredy send friend request to this user");
          break;
        case "SUCC":
          timeOutMessage("Request send succesfuly");
          break;
      }
    });
  };

  const acceptFriendRequests = (ID) => {
    if (waiting) return;
    setWaiting(true);
    axios
      .post(
        adress + "user/acceptFriendRequst",
        {
          requesterId: ID,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 201) {
          const newList = friendRequests.filter((item) => item.user.id !== ID);
          setFriendsRequests(newList);
          setFriends([...friends, response.data.friend]);
        }
        setWaiting(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFriends = () => {
    axios.post(adress + "user/findMany", { ids: props.user.friends }, { withCredentials: true }).then((response) => {
      setLoading(false);
      if (response.data.message == "DE") return;
      if (response.data.length == 0) {
        setanimGoing(false);
      }
      console.log(response.data);
      if (response.status === 200) {
        setFriends(response.data.users);
      }
    });
  };

  const getFriendRequests = () => {
    axios.post(adress + "user/userFindMany", { id: props.user.friendRequests }, { withCredentials: true }).then((response) => {
      setLoading(false);
      if (response.data.message == "DE") return;
      if (response.data.length == 0) {
        setanimGoing2(false);
      }
      setFriendsRequests(response.data);
    });
  };
  const transition = useTransition(friends, (item) => item.id, {
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
    // from: { marginTop: -100 },
    // enter: { marginTop: 0 },
    // leave: { marginTop: -100 },
    // config: { tension: 210, friction: 20 },
    // onStart: () => setanimGoing(false),
    onRest: () => (friends.length <= 0 ? setanimGoing(false) : setanimGoing(true)),
    config: config.wobbly,
    trail: 400 / friends.length,
  });
  const transition2 = useTransition(friendRequests, (item) => item.id, {
    // config: { tension: 210, friction: 20 },
    // from: { marginTop: -100 },
    // enter: { marginTop: 0 },
    // leave: { opacity: 0 },
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
    onRest: () => (friendRequests.length <= 0 ? setanimGoing2(false) : setanimGoing2(true)),
    config: config.wobbly,
    trail: 400 / friendRequests.length,
  });
  const [animUnderline, set] = useSpring(() => ({
    width: "0%",
  }));
  const [animNoFrieds, setanimFriends] = useSpring(() => ({
    opacity: 0,
    config: config.slow,
  }));
  const [animNoFriedsR, setanimFriendsR] = useSpring(() => ({
    opacity: 0,
    config: config.slow,
  }));
  const animButton = useSpring({
    to: async (next) => {
      await next({
        transform: textFocused ? "translate3d(0px,0,0) scale(1.2) rotateX(0deg)" : "translate3d(0px,0,0) scale(1) rotateX(0deg)",
      });
      await next({
        transform: textFocused ? "translate3d(0px,0,0) scale(1) rotateX(0deg)" : "translate3d(0px,0,0) scale(1) rotateX(0deg)",
      });
    },
    from: { transform: "translate3d(0px,0,0) scale(1) rotateX(0deg)" },
    config: { duration: 100 },
  });
  return (
    <div className="contt">
      <div className="const-send">
        <div className="const-form">
          <div className="input">
            <input
              autoComplete="off"
              onFocus={() => {
                set({ width: "100%" });
                setTextFocused(true);
              }}
              onBlur={() => {
                set({ width: "0%" });
                setTextFocused(false);
              }}
              type="text"
              name="email"
              placeholder="Friends ID"
              value={ID}
              onChange={(e) => setID(e.target.value)}
              required
            />
            <animated.div style={animUnderline} className="underline" />
          </div>
          <animated.button style={animButton} className="butonn" type="submit" onClick={add}>
            SEND
          </animated.button>
          <h6>{message}</h6>
        </div>
      </div>
      {/* <div className="devider"></div> */}
      {!animGoing ? (
        <div className="container-main-friends">
          {setanimFriends({ opacity: 1 })}
          <li className="cont-element">
            {props.loogedInStatus === "LOGGED_IN" && props.userLoading === "NO" ? (
              <animated.p style={animNoFrieds} className="profile-name">
                No friends
              </animated.p>
            ) : (
              <div className="img_cont">
                <img className="top1" src="/img/giphy.gif" />
              </div>
            )}
          </li>
        </div>
      ) : (
        <div className="container-main-friends">
          {transition.map(({ item, props: propsAnim, key }) => (
            <animated.li className="cont-element" key={key} style={propsAnim}>
              <div onClick={() => props.history.push("/profileFind/" + item.id)} className="container-sub-friends">
                <span className="pro">PRO</span>
                <div className="img_contt">
                  <img className="top1" src={loading ? "/img/giphy.gif" : `${adress + item.profileImg}`} />
                </div>
                <div className="profile-cont">
                  <h3 className="profile-name">{item.name}</h3>
                  <p>
                    User interface designer and <br /> front-end developer
                  </p>
                  <div className="buttons">
                    <button className="primary">Message</button>
                    <button className="primary ghost">Following</button>
                  </div>
                </div>
              </div>
            </animated.li>
          ))}
        </div>
      )}
      {/* <div className="devider"></div> */}
      {!animGoing2 ? (
        <div className="container-main-friendRequests">
          {setanimFriendsR({ opacity: 1 })}
          <li className="cont-element">
            {props.loogedInStatus === "LOGGED_IN" && props.userLoading === "NO" ? (
              <animated.p style={animNoFriedsR} className="profile-name">
                No friend request
              </animated.p>
            ) : (
              <div className="img_contt">
                <img className="top1" src="/img/giphy.gif" />
              </div>
            )}
          </li>
        </div>
      ) : (
        <div className="container-main-friendRequests">
          {transition2.map(({ item, props, key }) => (
            <animated.li className="cont-element" key={key} style={props}>
              <div className="container-sub-friendRequests">
                <span className="pro">PRO</span>
                <div className="img_contt">
                  <img className="top1" src={loading ? "/img/giphy.gif" : `data:image/gif;base64,${item.img}`} />
                </div>
                <div className="profile-cont">
                  <h3 className="profile-name">{item.name}</h3>
                  <p>
                    User interface designer and <br /> front-end developer
                  </p>
                  <div className="buttons">
                    {/* <button class="primary">Message</button> */}
                    <button className="primary" onClick={() => acceptFriendRequests(item.id)}>
                      Accept
                    </button>
                    <button className="primary ghost">Profile</button>
                  </div>
                </div>
              </div>
            </animated.li>
          ))}
        </div>
      )}
    </div>
  );
}

export default FriendPage;
