import { useContext, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { db } from "../../../firebase";

const GetChats = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getFetchChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        const chatMessage = Object.entries(doc.data())[0] || null;

        if (chatMessage) {
          dispatch({
            type: "SET_DEFAULT_USER",
            payload: {      
              chatId: chatMessage[0],
              user: {
                displayName: chatMessage[1].userInfo.displayName,
                photoURL: chatMessage[1].userInfo.photoURL,
                uid: chatMessage[1].userInfo.uid,
              },
            },
          });
        }
      });

      return () => { unsub() };
    };

    currentUser.uid && getFetchChats();
  }, [currentUser.uid, dispatch]);
};

export default GetChats;
