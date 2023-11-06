import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  
  const fireBaseTime = ({ seconds, nanoseconds }) => {
    return new Date(
      seconds * 1000 + nanoseconds / 1000000,
    )
  };

  return (
    <div
      ref={ref}
      className={`direct-chat-msg ${message.senderId === currentUser.uid && 'right' }`}
      style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: message.senderId === currentUser.uid ? ('flex-end') : ('flex-start'),
        }
      }
      
    >
      <div className="direct-chat-infos clearfix">
        <span
          className={`direct-chat-name ${message.senderId === currentUser.uid ? 'float-right' : 'float-left' }`}
        >
          Alexander Pierce
        </span>
      </div>
      <div>
        <img
          className="direct-chat-img"
          src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
          alt="Profil User"
        />
        <div
          className="direct-chat-text"
          style={{
            width: 'max-content',
            float: message.senderId === currentUser.uid ? 'right' : 'left',
            margin: '0 15px',
          }}
        >
          {
            message.img && (
              <img src={message.img} alt="" />
            )
          }
          {message.text}
        </div>
      </div>
      <span
        className={`direct-chat-timestamp ${message.senderId === currentUser.uid ? 'float-right' : 'float-left' }`}
      >
        {`${fireBaseTime(message.date).toDateString().toString("MMMM yyyy")} - ${fireBaseTime(message.date).toLocaleTimeString()}`}
      </span>
    </div>
  );
};

export default Message;
