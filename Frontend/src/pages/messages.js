import React, { useEffect, useState, useRef } from "react";
import { socket } from "../scripts/socket";
import adress from "../scripts/apiAddress";
import axios from "axios";
import "../css/messages.css";
import MessageRendering from "../Components/MemoComps";
import { animated, useSpring } from "react-spring";

function Messages(props) {
  const [message, setMessage] = useState("");
  const [createRoomName, setCreateRoomName] = useState("");
  const [joinRoomName, setJoinRoomName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [usersInRooms, setUsersInRooms] = useState([]);
  const [newUsersInRooms, setNewUsersInRooms] = useState([]);
  const [canScroll, setCanScroll] = useState(false);
  const [click, setClick] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [roomMessagesLen, setRoomMessagesLen] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(20);
  const chatContainer = useRef(null);
  const timeoutRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!canScroll) return;
    scrollToBot();
    setCanScroll(false);
  });

  useEffect(() => {
    let mouted = true;
    if (mouted && props.loogedInStatus === "LOGGED_IN" && props.userLoading === "NO") {
      loadRooms(props.user.rooms);
      socket.on("message", (message) => {
        setNewMessage(message);
        scrollToBot();
      });
      socket.on("allertMessage", (message) => {
        console.log(message.message);
        if (!message.joinedUsers) {
          return;
        }
        setUsersInRooms(message.joinedUsers);
      });
    }
    return () => (mouted = false);
  }, [props.userLoading]);

  useEffect(() => {
    if (!newMessage) return;
    setChatMessages([newMessage, ...chatMessages]);
    setCurrentIndex(currentIndex + 1);
    setCanScroll(true);
  }, [newMessage]);

  useEffect(() => {
    if (!newUsersInRooms) return;
    setUsersInRooms([...usersInRooms, ...newUsersInRooms]);
  }, [newUsersInRooms]);

  const joinRoom = (roomID) => {
    if (!roomID || roomID == currentRoom) return;
    setChatMessages([]);
    setUsersInRooms([]);
    setCurrentIndex(20);

    socket.emit("joinRoom", {
      name: props.user.name,
      room: roomID,
      _id: props.user.id,
      img: props.user.img,
      last: currentRoom,
    });
    setCurrentRoom(roomID);
    getChatMessages(roomID);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("chatMessage", message);
    setMessage("");
  };

  const createRoom = () => {
    axios.post(adress + "chatRooms/createRoom", { name: createRoomName }).then((response) => {
      if (response.status === 201) {
        console.log("room created");
      }
    });
  };

  const loadRooms = (ids) => {
    axios.post(adress + "chatRooms/loadRooms", { roomsToLoad: ids }).then((response) => {
      console.log(response.data.rooms);
      setUserRooms(response.data.rooms);
      joinRoom(props.user.rooms[0]);
    });
  };

  const joinNewRoom = () => {
    axios.post(adress + "chatRooms/joinNewRoom", { roomID: joinRoomName }).then((response) => {
      if (response.data.message != "RJ") return;
      loadRooms([...props.user.rooms, response.data.id]);
    });
  };

  const getRoomUsers = (ids) => {
    axios.post(adress + "user/userFindMany", { id: ids }, { withCredentials: true }).then((response) => {
      if (response.data.message == "DE") return;
      setUsersInRooms(response.data);
    });
  };

  const getChatMessages = (roomID) => {
    axios
      .post(adress + "chatRooms/getRoomContent", {
        roomToLoad: roomID,
      })
      .then((response) => {
        if (!response.data.messages) return;
        const reversed = response.data.messages.reverse();
        setChatMessages([...reversed]);
        setRoomMessagesLen(response.data.messagesLength);
        getRoomUsers(response.data.users);
      });
  };
  const loadMoreMessages = (roomID, chatMessages, index) => {
    axios
      .post(adress + "chatRooms/loadMoreMsgs", {
        roomToLoad: roomID,
        index: index,
      })
      .then((response) => {
        if (!response.data.messages) return;
        const reversed = response.data.messages.reverse();
        setChatMessages([...chatMessages, ...reversed]);
      });
  };

  const handleMessagesLoad = () => {
    if (roomMessagesLen + 20 < currentIndex) return;
    loadMoreMessages(currentRoom, chatMessages, currentIndex + 20);
    setCurrentIndex(currentIndex + 20);
  };

  const scrollToBot = () => {
    chatContainer.current.scrollTo(0, chatContainer.current.scrollHeight - chatContainer.current.clientHeight);
  };

  const onEnterPressSend = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false && /\S/.test(message)) {
      sendMessage(e);
    }
  };
  const copiedPopup = () => {
    setShowPopup(true);
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
      timeoutRef.current = null;
    }, 3000);
  };

  const getCurrent = () => {
    return userRooms.find((x) => x.id == currentRoom);
  };

  const checkIfTop = (e) => {
    if (
      e.target.clientHeight - e.target.scrollHeight >= Math.round(e.target.scrollTop - 10) &&
      e.target.clientHeight - e.target.scrollHeight <= Math.round(e.target.scrollTop + 10)
    ) {
      if (timeoutRef.current !== null) return;
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, 1500);
      handleMessagesLoad();
    }
  };

  const animateSideDiv = useSpring({
    right: click ? "-32%" : "0%",
  });
  const animBlur = useSpring({
    filter: click ? "blur(0px)" : "blur(10px)",
  });
  const animatePopup = useSpring({
    transform: showPopup ? "scale(1)" : "scale(0.75)",
    visibility: showPopup ? "visible" : "hidden",
    config: { mass: 1, tension: 180, friction: 8 },
  });
  const [animateMessageDiv, setAnimateMessageDiv] = useSpring(() => ({
    transform: "translate(-101%, 0)",
  }));

  return (
    <div className="cont-main-msg">
      <input type="text" name="idd" placeholder="" value={joinRoomName} onChange={(e) => setJoinRoomName(e.target.value)} />
      <button onClick={() => joinNewRoom()}>JOIN ROOM</button>
      <input type="text" name="id" placeholder="" value={createRoomName} onChange={(e) => setCreateRoomName(e.target.value)} />
      <button onClick={() => createRoom()}>CREATEROOM</button>
      <div className="messages-container">
        {!userRooms.length == 0 && currentRoom ? (
          <div className="room-nav">
            <animated.div style={animBlur} className="room-nav-ni">
              <p className="room-nav-name">{getCurrent().name}</p>
              <div>
                <p
                  className="room-nav-id"
                  onClick={() => {
                    navigator.clipboard.writeText(currentRoom);
                    copiedPopup();
                  }}
                >
                  id: {currentRoom}
                </p>
                <animated.span style={animatePopup} className="cop-pop">
                  Copied!
                </animated.span>
              </div>
            </animated.div>
            <animated.div style={animBlur} className="nav-div"></animated.div>
            <animated.div style={animateSideDiv} className="side-menu-users">
              <button style={{ position: "absolute", right: "100%" }} onClick={() => setClick(!click)} className="button-show-users">
                Info
              </button>
              <div className="profile-stats-h">
                <div>
                  <span className="number-h">{roomMessagesLen}</span>
                  <span className="desc-h">messages</span>
                </div>
                <div>
                  <span className="number-h">{usersInRooms.length}</span>
                  <span className="desc-h">users</span>
                </div>
                <div>
                  <span className="number-h">108</span>
                  <span className="desc-h">letters</span>
                </div>
              </div>
              <div className="side-div"></div>
              <p className="all-users-desc">All users:</p>
              <ul className="list-all-users">
                {usersInRooms.map((user) => (
                  <li className="list-element-all-users" key={Math.floor(Math.random() * 10000)}>
                    <div onClick={() => props.history.push("/profileFind/" + user.user.id)} className="all-users-user">
                      <div className="chat-img-cont">
                        <img className="all-users-user-pic" src={`data:image/gif;base64,${user.user.img}`} />
                      </div>
                      <p>{user.user.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </animated.div>
          </div>
        ) : (
          <div></div>
        )}
        <animated.div style={animBlur} className="chat-rooms-cont">
          {userRooms.map((room) => (
            <li
              key={Math.floor(Math.random() * 10000)}
              onClick={() => {
                joinRoom(room.id);
              }}
            >
              <a>{room.name}</a>
            </li>
          ))}
          <div className="chat-rooms-div"></div>
        </animated.div>
        <animated.ul style={animBlur} className="chat-container" ref={chatContainer} onScroll={(e) => checkIfTop(e)}>
          <MessageRendering chatMessages={chatMessages} usersInRooms={usersInRooms} user={props.user}></MessageRendering>
        </animated.ul>
        <animated.form
          style={animBlur}
          onSubmit={(e) => (/\S/.test(message) ? sendMessage(e) : e.preventDefault())}
          className="chat-message-send-cont"
        >
          <textarea
            type="text"
            name="message"
            placeholder="Message"
            ref={textAreaRef}
            onFocus={() => setAnimateMessageDiv({ transform: "translate(-25% , 0)" })}
            onBlur={() => setAnimateMessageDiv({ transform: "translate(-101% , 0)" })}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => onEnterPressSend(e)}
          />
          <animated.button style={animateMessageDiv} type="submit" onClick={() => textAreaRef.current.focus()}>
            SEND
          </animated.button>
        </animated.form>
      </div>
    </div>
  );
}
export default Messages;
