import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../../../firebase";

import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";

import Messages from "./Messages";
import Input from "../../../components/Input";

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
      <Messages />
      {/* <Input dataChat={data} currentUser={currentUser}  allowChat={allowChat} /> */}
    </div>
  );
};

export default Chat;
