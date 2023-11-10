import React, { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import {
  arrayUnion, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc,
} from "firebase/firestore";
// import { sendEmailVerification } from "firebase/auth";


import { db } from "../../../firebase";

import ButonComponents from '../../../components/Button';

import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";

import { uploadFile } from "../../../data/uploadFile";

import { checkThisFileIsImageOrNot } from "../../../Helper/checkFile";
import { catchError } from "../../../Helper/helper";

const ChatsCard = ({
    cardTool, children, title, adminData,
}) => {
    const [dataMessage, setMessageData] = useState({ messages: [], allow_chat: false });
    const [chatCheckValid, setchatCheckValid] = useState(false);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [onSend, setOnSend] = useState(false);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
  
    useEffect(() => {
        // sendEmailVerification(currentUser);
        const unSub = onSnapshot(
            doc(db, "chats", data.chatId),
            (doc) => {
                if (doc.exists()) {
                    setMessageData(doc.data());
                    setchatCheckValid(true);
                }
            }, (err) => {
                NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
            }
        );
    
        return () => {
            data.chatId !== 'null' && unSub();
        };
    }, [data.chatId]);

    const handleSend = async () => {
        setOnSend(true);

        try {
            if (file) {
                const thisFileisImage = checkThisFileIsImageOrNot(file);
                if (!thisFileisImage) throw new Error ('Hanya Boleh Mengupload Gambar');

                const uploadImage = await uploadFile(file, 'message/images/');
                
                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: uploadImage,
                    }),
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

            let lastMessageText = text;
            if (file && text === '') {
                lastMessageText = checkThisFileIsImageOrNot(file) ? 'Mengkirimkan Gambar' : 'Mengikirimkan Video';
            }
          
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text: lastMessageText,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
        
            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text: lastMessageText,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
            
            await setText('');
            await setFile(null);
        } catch (err) {
            NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
        } finally {
            await setOnSend(false);
        }
    }

    const checkImage = (e) => {
        const thisFileisImage = checkThisFileIsImageOrNot(e.target.files[0]);
        if (!thisFileisImage) {
            NotificationManager.warning('Hanya Boleh Mengungah Gamabr', 'Terjadi Kesalahan', 5000);
        } else {
            setFile(e.target.files[0]);
        }
    }

    const { minimize, close } = cardTool
    const { allow_chat: allowChat } = dataMessage

    console.log(currentUser);
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
            {
                adminData && (
                    <div className="card-body">
                        {children}
                    </div>
                )
            }
            {
                (chatCheckValid) || (
                    <div className="overlay">
                        <i className="fas fa-2x fa-sync-alt fa-spin"></i>
                    </div>
                )
            }
            <div className="card-footer">
                <div className='row'>
                    <div className="col-md-6 my-2">
                        {
                            file && (
                                <div
                                    className="shadow"
                                    style={{
                                        borderRadius: '0.3rem',
                                        backgroundColor: '#d2d6de',
                                        border: '1px solid #d2d6de',
                                        margin: '5px',
                                        padding: '5px',
                                        position: 'absolute',
                                        bottom: '40px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    {
                                        checkThisFileIsImageOrNot(file)
                                        ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                className="m-2"
                                                style={{ width: '400px', objectFit: 'cover' }}
                                                alt=""
                                            />
                                        )
                                        : ( 
                                            <video className="m-2" width="400px" controls style={{ objectFit: 'cover' }}>
                                                <source src={URL.createObjectURL(file)} type="video/mp4" />
                                                Your browser does not support HTML video.
                                            </video>
                                        )
                                    }
                                    <ButonComponents
                                        buttonType="btn-default m2"
                                        buttonAction={() => setFile(null)}
                                        buttonText="Hapus File"
                                        buttonIcon="fa fa-trash"
                                    />
                                </div>
                            )
                        }
                        {
                            allowChat && (
                                <input
                                    type="text"
                                    name="message"
                                    placeholder="Isi Pesan Anda..."
                                    className="form-control mx-2"
                                    onChange={(e) => setText(e.target.value)}
                                    value={text}
                                />
                            )
                        }
                    </div>
                    <div className="col-md-6 my-2">
                        <div className='d-flex'>
                            <div className="d-flex align-items-center flex-column w-100 mx-2">
                                <input
                                    id="file"
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        try {
                                            checkImage(e);
                                        } catch {
                                            setFile(null);
                                        }
                                    }}
                                />
                                <label htmlFor="file" style={{ marginBottom: 'unset' }}>
                                    <div
                                        className="btn btn-default"
                                        disabled={((file && text) || onSend)}
                                        style={{ width: '200px' }}
                                    >
                                        <i className="fas fa-file mr-2" />
                                        {!file ? "Upload Gambar" : "Ganti Gambar"}
                                    </div>
                                </label>
                            </div>
                            <ButonComponents
                                type="button"
                                buttonType="btn-primary w-100 mx-2"
                                buttonAction={handleSend}
                                buttonText={onSend || 'Kirim'}
                                buttonIcon={onSend ? "fas fa-sync-alt fa-spin" : 'fa fa-paper-plane'}
                                disabled={onSend || (( text === '') && (file === null) )}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <NotificationContainer />
        </div>
    )
}

export default ChatsCard;
