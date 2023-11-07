import React, { Component } from 'react';
import {
  collection, query, where, getDocs, setDoc,
  doc, updateDoc, serverTimestamp, getDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

import Messages from './components/Messages'
import ChatsCard from './components/ChatsCard';

import GetChats from './config/GetChat';


class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adminData: null,
      text: '',
      img: null,
    };
  }

  componentDidMount = async () => {
    this.getAdminData();
  }

  getAdminData = async () => {
    const q = query(collection(db, "users"), where("is_admin", "==", true));
  
    try {
      const userData = await getDocs(q);
      const { uid, displayName, photoURL } = userData.docs.map(doc => doc.data())[0];
      this.setState({
        adminData: {
          uid, displayName, photoURL,
        },
      }, () => {
        this.setupMessageBox();
      })
    } catch (err) {
      alert("Something Wrong find User");
    }
  }
  
  setupMessageBox = async () => {
    const {
      adminData: { uid: adminUid },
    } = this.state;
    const {
      dataLogin: { uid: currentUid },
    } = this.props;
    
    const combinedId = currentUid > adminUid ? currentUid + adminUid : adminUid + currentUid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        this.setNewMessage(combinedId);
      }
    } catch (err) {
      alert('Error when Create a new Chats');
    }
  }

  setNewMessage = async (combinedId) => {
    const {
      adminData: {
        uid: adminUid,
        displayName: adminDisplayName,
        photoURL: adminPhotoURL,
      },
    } = this.state;
    const {
      dataLogin: {
        uid: currentUid,
        displayName: currentDisplayName,
        photoURL: currentPhotoURL,
      },
    } = this.props;

    await setDoc(doc(db, "chats", combinedId), { messages: [], allow_chat: false });

    await updateDoc(doc(db, "userChats", currentUid), {
      [combinedId + ".userInfo"]: {
        uid: adminUid,
        displayName: adminDisplayName,
        photoURL: adminPhotoURL,
      },
      [combinedId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", adminUid), {
      [combinedId + ".userInfo"]: {
        uid: currentUid,
        displayName: currentDisplayName,
        photoURL: currentPhotoURL,
      },
      [combinedId + ".date"]: serverTimestamp(),
    });
  }
  
  changeForm = (key, value) => {
    this.setState({
      [key]: value,
    })
  }

  render() {
    const { adminData, text, img } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <ChatsCard
            title="Chat to Admin"
            adminData={adminData}
            cardTool={{
              minimize: false,
              close: false,
            }}
            changeForm={this.changeForm}
            handleSend={this.handleSend}
            form={{ img, text }}
          >
            <GetChats />
            <div
              className="direct-chat-messages"
              style={{
                height: 'unset',
                maxHeight: '600px',
              }}>
              <div className="direct-chat-msg">
                <Messages />
              </div>
            </div>
          </ChatsCard>
        </div>
      </div>
    );
  }
}

export default ChatPage;
