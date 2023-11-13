import React, { Component } from "react";
import update from "immutability-helper";
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { auth, db } from "../../firebase";

import FormValidation from "../../components/FormValidation";
import InputEmail from "../../components/form/InputEmail";
import InputPassword from "../../components/form/InputPassword";
import ButonComponents from '../../components/Button';

import { GENERATE_ERROR_MESSAGE, validateEmail } from "../../Helper/error";
import { catchError } from "../../Helper/helper"

import './style.scss';;

class Login extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
                email: '',
                password: '',
            },
            loading: false,
            isFormSubmitted: false,
        };
    }
    
    _onInputChangeValidate = ({ target }) => {
        this.form.validateInput(target);
    };

    _changeInputHandler = async (type, val, e) => {
        const { form, isFormSubmitted } = this.state;

        if (isFormSubmitted) {
            const onInputChangeValidate = this._onInputChangeValidate(e);
            await onInputChangeValidate;
        }

        const newForm = update(form, {
            [type]: { $set: val },
        });

        this.setState({
            form: newForm,
        });
    };

    submitHandel = async () => {
        const isFormValid = await this.form.validateForm();

        if (isFormValid) {
            this.setState({
                loading: true,
            }, async () => {
                await this.handleSubmit();
            });
        }
    
        this.setState({
          isFormSubmitted: true,
        });
    }

    handleSubmit = async () => {
        const {
            form : { email, password },
        } = this.state;
        
        try {
            const data = await query(collection(db, "users"), where("email", "==", email));
            const userData = await getDocs(data);
            const findData = userData.docs.map(doc => doc.data())[0];
            if (!findData) throw new Error('Email Belum Terdaftar');

            const { is_admin: isAdmin, email: loginEmail } = findData;

            if (!isAdmin) {
                await signInWithEmailAndPassword(auth, loginEmail, password).then(() => {
                    window.location.href = "/";
                }).catch((err) => {
                    throw new Error('Email dan Password Anda Salah')
                });
            } else {
                throw new Error('Tidak Memiliki Akses');
            }
        } catch (err) {
            this.setState({
                loading: false,
            }, async () => {
                const errorText = catchError(err);
                this.handleExpectedError(errorText);
            });
        }
    }

    handleExpectedError = (text) => {
        NotificationManager.error(text, 'Terjadi Kesalahan', 5000);
    }

    render() {
        const {
            form: { email, password },
            loading,
        } = this.state;

        return (
            <div className="loginContiner">
                <div className="login-box">
                    <div
                        className="login-logo" 
                        onClick={() => window.location.href = "#/" }
                        style={{ cursor: 'pointer' }}
                    >
                        <b>Admin</b>LTE
                    </div>
                    <div className="card">
                        <div className="card-body login-card-body">
                            <p className="login-box-msg">Silakan login</p>
                            
                            <FormValidation ref={(c) => { this.form = c; }}>
                                <div className="d-flex flex-column mb-2">
                                    <InputEmail
                                        placeholder="Email"
                                        id="email"
                                        name="emailPerson"
                                        value={email}
                                        changeEvent={(val, e) => this._changeInputHandler('email', val, e)}
                                        required
                                    />
                                    <FieldFeedbacks for="emailPerson">
                                        <div>
                                            <FieldFeedback when="valueMissing">
                                                {GENERATE_ERROR_MESSAGE('Email Anda', 'valueMissing')}
                                            </FieldFeedback>
                                            <FieldFeedback when={val => !validateEmail(val)}>
                                                {GENERATE_ERROR_MESSAGE('Email Anda', 'emailInvalid')}
                                            </FieldFeedback>
                                        </div>
                                    </FieldFeedbacks>
                                </div>
                                <div className="d-flex flex-column mb-2">
                                    <InputPassword
                                        placeholder="Password"
                                        name="password"
                                        changeEvent={(val, e) => this._changeInputHandler('password', val, e)}
                                        value={password}
                                        required
                                    />
                                    <FieldFeedbacks for="password">
                                        <FieldFeedback when="valueMissing">
                                            {GENERATE_ERROR_MESSAGE('Password Anda', 'valueMissing')}
                                        </FieldFeedback>
                                    </FieldFeedbacks>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <ButonComponents
                                            type="button"
                                            buttonType="btn btn-primary btn-block"
                                            buttonAction={() => { this.submitHandel(); }}
                                            buttonText={loading ? 'Memperoses' : 'Silakan Masuk'}
                                            buttonIcon={loading ? 'fas fa-sync-alt fa-spin' : 'fas fa-sign-in-alt'}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </FormValidation>
                            <p
                                className="m-2 text-center" 
                                onClick={() => window.location.href = "#/lupa-password" }
                                style={{ cursor: 'pointer' }}
                            >
                                Lupa Password
                            </p>    

                            <p
                                className="m-2 text-center" 
                                onClick={() => window.location.href = "#/register" }
                                style={{ cursor: 'pointer' }}
                            >
                                Daftar Menjadi Pengguna
                            </p>    
                        </div>
                    </div>
                </div>
                
                <NotificationContainer />
            </div>
        );
    }
};

export default Login;
