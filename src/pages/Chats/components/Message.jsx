import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { checkfileUrl } from "../../../Helper/checkFile";

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
      className={`direct-chat-msg ${message.senderId === currentUser.uid && 'right' } my-4`}
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
          {
            message.senderId === currentUser.uid
            ? currentUser.displayName
            : data.user.displayName
          }
        </span>
      </div>
      <div className="d-flex flex-row-reverse">
        <img
          className="direct-chat-img"
          src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
          alt="Profil User"
        />
        <div className="d-flex flex-column">
          {
            message.img && (
              <div
                className="direct-chat-text my-2"
                style={{
                  float: message.senderId === currentUser.uid ? 'right' : 'left',
                  margin: '0 15px',
                  wordBreak: 'keep-all',
                }}
              >
                {
                  checkfileUrl(message.img)
                  ? (
                    <img
                        src={message.img}
                        className="m-2"
                        style={{ width: '400px', objectFit: 'cover' }}
                        alt=""
                    />
                  )
                  : (
                    <video className="m-2" width="400px" controls style={{ objectFit: 'cover' }}>
                        <source src={message.img} type="video/mp4" />
                        Your browser does not support HTML video.
                    </video>
                  )
                }
              </div>
            )
          }
          {
            message.text !== '' && (
              <div
                className="direct-chat-text my-2"
                style={{
                  float: message.senderId === currentUser.uid ? 'right' : 'left',
                  margin: '0 15px',
                  wordBreak: 'keep-all',
                }}
              >
                {message.text}
              </div>
            )
          }
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
