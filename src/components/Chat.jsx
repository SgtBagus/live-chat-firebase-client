import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

import Messages from "./Messages";
import Input from "./Input";
import Navbar from "./Navbar";

const Chat = () => {
  const [allowChat, setAllowChat] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setAllowChat(doc.data().allow_chat);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="sidebar-message">
          <div className='navbar'>
            <div className="user">
              <img src={data.user?.photoURL} alt="" />
              <span>{data.user?.displayName}</span>
            </div>
          </div>
        </div>
        <div className="sidebar-message">
          <Navbar />
        </div>
      </div>
      <Messages />
      <Input dataChat={data} currentUser={currentUser}  allowChat={allowChat} />
    </div>
  );
};

export default Chat;
