import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../../firebase";

import { uploadFile } from "../../data/uploadFile";

import './style.scss';

const Register = () => {
    const [img, setImg] = useState(null);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
    
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const date = new Date().getTime();
            
            const uploadImage = await uploadFile(file, `userProfile/${displayName.replaceAll(' ', '_') + date}`);
        
            await updateProfile(res.user, {
                displayName,
                photoURL: uploadImage,
            });
            
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL: uploadImage,
                is_admin: false,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
        } catch (err) {
            setErr(true);
            setLoading(false);
        }
      };

  return (
    <div className="loginContiner">
        <div className="login-box">
            <div className="login-logo">
                <Link to="/">
                    <b>Admin</b>LTE
                </Link>
            </div>
            <div className="card">
                <div className="card-body login-card-body">
                    <p className="login-box-msg">Daftarkan Diri Anda !</p>

                    <form onSubmit={handleSubmit} method="post">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Nama Anda" required />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="email" className="form-control" placeholder="Email" required />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-envelope"></span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Password" required />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input
                                required
                                style={{ display: "none" }}
                                type="file"
                                id="file" 
                                onChange={(e) => {
                                    try {
                                        setImg(e.target.files[0]);
                                    } catch {
                                        setImg(null);
                                    }
                                }}
                            />
                            <label htmlFor="file" className="w-100" style={{ marginBottom: 'unset' }}>
                                {
                                    img && (
                                        <img
                                            src={URL.createObjectURL(img)}
                                            className="w-100 mb-2"
                                            style={{ objectFit: 'cover', borderRadius: '5px'}}
                                            alt=""
                                        />
                                    )
                                }
                                <div className="btn btn-default btn-block">
                                    <i className="fas fa-file mr-2" />
                                    Upload Foto Anda
                                </div>
                            </label>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                                    Sign In
                                </button>                    
                                {loading && "Uploading and compressing the image please wait..."}
                                {err && <span>Something went wrong</span>}
                            </div>
                        </div>
                    </form>

                    <p className="m-2 text-center">
                        <Link to="/login">Sudah Jadi Pengguna</Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Register;
