import React from "react";
import { useRef, useEffect } from "react";
// const chatContainer = useRef(0);
function MessageRendering({ chatMessages, usersInRooms, user }) {
  if (usersInRooms.length == 0) return <div></div>;
  // let index = usersInRooms.findIndex((x) => x.user.id == chatMessage._id);
  // if (index == -1) return;
  return chatMessages.map((chatMessage) => (
    <li
      className={user.id == chatMessage._id ? "message-me" : "message-them"}
      key={Math.floor(Math.random() * 1000000)}
    >
      {chatMessage._id ? (
        <div className="user-msg-cont">
          <div className="div-line"></div>
          <div className="chat-img-cont">
            <img
              className="chat-prof-pic"
              src={`data:image/gif;base64,${
                usersInRooms[
                  usersInRooms.findIndex((x) => x.user.id == chatMessage._id)
                ].user.img
              }`}
            />
          </div>
          <div className="msg-time-name">
            <a className="message-name">
              <p className="name">
                {
                  usersInRooms[
                    usersInRooms.findIndex((x) => x.user.id == chatMessage._id)
                  ].user.name
                }
              </p>
              <p className="dot">•</p>
              <p className="time-for">{chatMessage.time}</p>
            </a>
            <a className="message-text">{chatMessage.msg}</a>
            {/* <a className="message-time">{chatMessage.time}</a> */}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </li>
  ));
  // </ul>
}

export default React.memo(MessageRendering);
