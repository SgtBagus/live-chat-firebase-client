import React from 'react';
import { signOut } from "firebase/auth"

import ButonComponents from '../../components/Button';

import { auth } from '../../firebase';

const buttonActionLogin = () => {
    window.location.href = "/login";
}

export const HeaderComponents = ({ dataLogin }) => {
    return (
        <div className="main-header navbar navbar-expand-md navbar-light navbar-white">
            <div className="container">
                <div className="navbar-brand">
                    <span className="brand-text font-weight-light">AdminLTE 3</span>
                </div>

                <div className="collapse navbar-collapse order-3" id="navbarCollapse">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="/" className="nav-link">Home</a>
                        </li>
                        {
                            dataLogin && (
                                <li className="nav-item">
                                    <a href="/chat" className="nav-link">Chat</a>
                                </li>
                            )
                        }
                    </ul>
                </div>
                
                <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto d-flex align-items-center">
                    {
                        dataLogin && (
                            <li className="nav-item mx-3">
                                <div className="user-panel d-flex">
                                    <div className="image">
                                        <img
                                            src={dataLogin.photoURL}
                                            alt="User"
                                            style={{
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                width: '30px',
                                                height: '30px',
                                            }}
                                        />
                                    </div>
                                    <div className="info d-block">{dataLogin.displayName}</div>
                                </div>
                            </li>
                        )
                    }
                    <li className="nav-item mx-3">
                        <ButonComponents
                            buttonType={dataLogin ? "btn-danger" : "btn-primary"}
                            buttonAction={dataLogin ? ()=>signOut(auth) : buttonActionLogin}
                            buttonText={dataLogin ? "Logout" : "Login"}
                            buttonIcon={dataLogin ? "fas fa-sign-out-alt" : "fas fa-sign-in-alt"}
                        />
                    </li>
                </ul>
            </div>
        </div>
    )
}