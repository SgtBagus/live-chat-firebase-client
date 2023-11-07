import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { auth, db } from "../../firebase";

import './style.scss';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);

        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            const data = query(collection(db, "users"), where("email", "==", email));
            const userData = await getDocs(data);
            
            const findData = userData.docs.map(doc => doc.data())[0];

            if (!findData) throw new Error ('Tidak Terdaftar');
            const { is_admin: isAdmin, email: loginEmail } = findData;

            if (!isAdmin) {
                await signInWithEmailAndPassword(auth, loginEmail, password).then(() => {
                    navigate("/");
                }).catch(() => {
                    throw new Error('Something went wrong')
                });
            } else {
                throw new Error('Tidak Memiliki Akses');
            }
        } catch (err) {
            alert(err);
        } finally {
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
                        <p className="login-box-msg">Silakan login</p>

                        <form onSubmit={handleSubmit} method="post">
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Email" />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" className="form-control" placeholder="Password" />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary btn-block">
                                        {
                                            loading ? (
                                                <i className="fas fa-sync-alt fa-spin"></i>
                                            ) : (
                                                "Silakan Masuk"
                                            )
                                        }
                                    </button>
                                </div>
                            </div>
                        </form>

                        <p className="m-2 text-center">
                            <Link to="/register">Daftar Menjadi Pengguna</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
