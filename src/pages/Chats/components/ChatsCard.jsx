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
    const [dataMessage, setMessageData] = useState(
        {
            messages: [],
            allow_chat: false,
        }
    );
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const [onSend, setOnSend] = useState(false);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
  
    useEffect(() => {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessageData(doc.data());
      });
  
      return () => {
        unSub();
      };
    }, [data.chatId]);

    const handleSend = async () => {
        setOnSend(true);

        try {
            if (img) {
                const storageRef = ref(storage, uuid());
                console.log(storageRef);
                const uploadTask = uploadBytesResumable(storageRef, img);
            
                await uploadTask.on((error) => { alert(error); }, async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
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
                });
            } else {
                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
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
            
            await setText('');
            await setImg(null);
        } catch (err) {
            alert(err);
        } finally {
            setOnSend(false);
        }
    }

    const { minimize, close } = cardTool
    const { messages, allow_chat: allowChat } = dataMessage

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
            {
                messages.length > 0 || (
                    <div className="overlay">
                        <i className="fas fa-2x fa-sync-alt fa-spin"></i>
                    </div>
                )
            }
            <div className="card-footer">
                {/* <form action="#" method="post"> */}
                    <div className='row'>
                        <div className="col-md-8 my-2">
                            {
                                img && (
                                    <div
                                        style={{
                                            borderRadius: '0.3rem',
                                            backgroundColor: '#d2d6de',
                                            border: '1px solid #d2d6de',
                                            margin: '5px',
                                            padding: '5px',
                                            position: 'absolute',
                                            bottom: '60px',
                                        }}
                                    >
                                        <img
                                            src={URL.createObjectURL(img)}
                                            className="m-2"
                                            style={{ width: '250px', objectFit: 'cover' }}
                                            alt=""
                                        />
                                    </div>
                                )
                            }
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
                        </div>
                        <div className="col-md-4 my-2">
                            <div className='d-flex'>
                                <div className="d-flex align-items-center flex-column w-100 mx-2">
                                    <input
                                        id="file"
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            try {
                                                setImg(e.target.files[0]);
                                            } catch {
                                                setImg(null);
                                            }
                                        }}
                                    />
                                    <label htmlFor="file" style={{ marginBottom: 'unset' }}>
                                        <div
                                            className="btn btn-default"
                                            disabled={((img && text) || onSend)}
                                            style={{ width: '200px' }}
                                        >
                                            <i className="fas fa-file mr-2" />
                                            {!img ? "Upload Gambar" : "Ganti Gambar"}
                                        </div>
                                    </label>
                                </div>
                                <ButonComponents
                                    buttonType="btn-primary w-100 mx-2"
                                    buttonAction={handleSend}
                                    buttonText={onSend || 'Kirim'}
                                    buttonIcon={onSend ? "fas fa-sync-alt fa-spin" : 'fa fa-paper-plane'}
                                    disabled={onSend || (( text === '') && (img === null) )}
                                />
                            </div>
                        </div>
                    </div>
                {/* </form> */}
            </div>
        </div>
    )
}

export default ChatsCard;
