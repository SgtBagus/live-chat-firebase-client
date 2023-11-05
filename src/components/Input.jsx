import React, { Component } from "react";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  arrayUnion, doc, serverTimestamp, Timestamp, updateDoc,
} from "firebase/firestore";


import { db, storage } from "../firebase";

import Img from "../img/img.png";
import Attach from "../img/attach.png";

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      img: null,
    };
  }

  changeForm = (key, value) => {
    this.setState({
      [key]: value,
    })
  }

  handleSend = async () => {
    const { currentUser, dataChat } = this.props; 
    const { text, img } = this.state;

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", dataChat.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", dataChat.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [dataChat.chatId + ".lastMessage"]: {
        text,
      },
      [dataChat.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", dataChat.user.uid), {
      [dataChat.chatId + ".lastMessage"]: {
        text,
      },
      [dataChat.chatId + ".date"]: serverTimestamp(),
    });

    this.setState({
      text: '',
      img: null,
    })
  }
  
  render() {
    const { allowChat } = this.props;
    const { text, img } = this.state;

    return (
      <div className="input">
        {
          allowChat && (
            <input
              type="text"
              placeholder="Type something..."
              onChange={(e) => this.changeForm('text', e.target.value)}
              value={text}
            />
          )
        }
        {
          img !== null && (<img src={URL.createObjectURL(img)} alt="" width="150" height="150" />)
        }
        <div className="send">
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            onChange={(e) => this.changeForm('img', e.target.files[0])}
          />
          <label htmlFor="file">
            <img src={Attach} alt="" />
            <img src={Img} alt="" />
          </label>
          <button onClick={() => { this.handleSend() }}>Send</button>
        </div>
      </div>
    );
  }
}

export default Input;
