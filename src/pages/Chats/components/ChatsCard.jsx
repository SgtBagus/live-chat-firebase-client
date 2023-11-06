import React, { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import {
  arrayUnion, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import ButonComponents from '../../../components/Button';

import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";

import { db, storage } from "../../../firebase";

const ChatsCard = ({
    cardTool, children, title,
}) => {
    const [allowChat, setAllowChat] = useState([]);
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);

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

    const handleSend = async () => {
        try {
            if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);
        
            uploadTask.on(
                (error) => { alert(error); },
                () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, "chats", data.chatId), {
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
                console.log(data.chatId);
                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: data.uid,
                        date: Timestamp.now(),
                    }),
                });
            }
        
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
        
            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
        
            setText('');
            setImg(null);
        } catch (err) {
            alert(err);
        }
    }

    const { minimize, close } = cardTool
    return (
        <div className="card direct-chat direct-chat-warning">
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
                {
                    cardTool && (
                        <div className="card-tools">
                            {
                                minimize && (
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus"></i>
                                    </button>
                                )
                            }
                            {
                                close && (
                                    <button type="button" className="btn btn-tool" data-card-widget="remove">
                                        <i className="fas fa-times"></i>
                                    </button>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <div className="card-body">
                {children}
            </div>
            <div className="card-footer">
                <form action="#" method="post">
                    <div className='row align-items-end'>
                        <div className="col-md-3">
                            <input
                                id="file"
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    console.log(e);
                                    try {
                                        setImg(e.target.files[0]);
                                    } catch {
                                        setImg(null);
                                    }
                                }}
                            />
                            <div className="d-flex align-items-center flex-column m-2">            
                                {
                                    img && (
                                        <img
                                            src={URL.createObjectURL(img)}
                                            className="mb-2"
                                            style={{ width: '180px', objectFit: 'cover' }}
                                            alt=""
                                        />
                                    )
                                }
                                <label htmlFor="file" style={{ marginBottom: 'unset' }}>
                                    <ButonComponents
                                        buttonType="btn-default"
                                        buttonAction={() => { }}
                                        buttonText={!img ? "Upload Gambar" : "Ganti Gambar"}
                                        buttonIcon="fas fa-file"
                                        style={{ width: '200px' }}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className='d-flex m-2'>
                                {
                                    allowChat && (
                                        <input
                                            type="text"
                                            name="message"
                                            placeholder="Type Message ..."
                                            className="form-control mx-2"
                                            onChange={(e) => setText(e.target.value)}
                                            value={text}
                                        />
                                    )
                                }
                                <ButonComponents
                                    buttonType="btn-primary"
                                    buttonAction={handleSend}
                                    buttonText="Kirim"
                                    buttonIcon="fa fa-paper-plane"
                                    style={{ width: '120px' }}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChatsCard;
