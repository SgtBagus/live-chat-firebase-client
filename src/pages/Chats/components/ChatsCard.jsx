import React, { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { NotificationManager } from 'react-notifications';
import {
  arrayUnion, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";

import Modals from "../../../components/Modals";
import ButonComponents from '../../../components/Button';
import InputText from "../../../components/form/InputText";

import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";

import { uploadFile } from "../../../data/uploadFile";

import { checkThisFileIsImageOrNot } from "../../../Helper/checkFile";
import { catchError } from "../../../Helper/helper";

import defaultImage from '../defaultImage.png';

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
            NotificationManager.warning('Hanya Boleh Mengungah Gambar', 'Terjadi Kesalahan', 5000);
        } else {
            setFile(e.target.files[0]);
        }
    }

    const { minimize, close } = cardTool
    const { allow_chat: allowChat } = dataMessage

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
                    <div className="col-md-6 col-xs-12 my-2">
                        {
                            allowChat && (
                                <InputText
                                    name="message"
                                    placeholder="Isi Pesan Anda..."
                                    value={text}
                                    changeEvent={(val, e) => setText(val)}
                                    disabled={onSend}
                                />
                            )
                        }
                    </div>
                    <div className="col-md-6 col-xs-12 my-2">
                        <div className='d-flex'>
                            <div className="d-flex align-items-center flex-column w-100 mx-2">
                                <Modals
                                    buttonIcon="fas fa-file mx-2"
                                    buttonLabel="Gambar"
                                    className="w-100"
                                    btnSubmitHandel={handleSend}
                                    btnCancelHandel={() => setFile(null)}
                                    btnSubmitText={onSend ? '' : 'Kirim'}
                                    disabled={onSend}
                                    buttonSubmitIcon={onSend ? "fas fa-sync-alt fa-spin" : 'fa fa-paper-plane mr-2'}
                                    btnSubmitDisabled={onSend || (( text === '') && (file === null) )}
                                >
                                    <div className="row">
                                        <div className="col-md-12 my-2">
                                            <img
                                                src={file ? URL.createObjectURL(file) : defaultImage}
                                                className="rounded w-100"
                                                style={{ objectFit: 'cover' }}
                                                alt=""
                                            />
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
                                            <label htmlFor="file" className="mt-2 w-100" style={{ marginBottom: 'unset' }}>
                                                <div
                                                    className="btn btn-default w-100"
                                                >
                                                    <i className="fas fa-file mr-2" />
                                                    {!file ? "Upload Gambar" : "Ganti Gambar"}
                                                </div>
                                            </label>
                                        </div>
                                        {
                                            allowChat && (
                                                <div className="col-md-12 my-2">
                                                    <InputText
                                                        name="message"
                                                        placeholder="Isi Pesan Anda..."
                                                        value={text}
                                                        changeEvent={(val, e) => setText(val)}
                                                        disabled={onSend}
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                </Modals>
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
        </div>
    )
}

export default ChatsCard;
