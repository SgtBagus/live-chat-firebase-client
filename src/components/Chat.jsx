import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

import Messages from "./Messages";
import Input from "./Input";
import Navbar from "./Navbar";

const Chat = () => {
  const { data } = useContext(ChatContext);

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
      <Input/>
    </div>
  );
};

export default Chat;
