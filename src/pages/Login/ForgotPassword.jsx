import React, { Component } from "react";
import update from "immutability-helper";
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../../firebase";

import FormValidation from "../../components/FormValidation";
import InputEmail from "../../components/form/InputEmail";
import ButonComponents from '../../components/Button';

import { GENERATE_ERROR_MESSAGE, validateEmail } from "../../Helper/error";
import { catchError } from "../../Helper/helper"

import './style.scss';;

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
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
                await this.passwordReset();
            });
        }
    
        this.setState({
          isFormSubmitted: true,
        });
    }

    passwordReset = async () => {
        const {
            form: { email }
        } = this.state;

        try {
            await sendPasswordResetEmail(auth, email).then(() => {
                NotificationManager.success('Mohon cek Email Anda!', 'Email Sudah Terkirim', 5000);
            })
            .catch((error) => {
                throw new Error(error);
            });
        } catch (err) {
            NotificationManager.error(catchError(err), 'Email Sudah Terkirim', 5000);
        }
        
        this.setState({
            isFormSubmitted: true,
            loading: false,
        });
    }

    render() {
        const {
            form: { email }, loading,
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
                            <p className="login-box-msg">Lupa Password</p>
                            
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
                                <div className="row">
                                    <div className="col-12">
                                        <ButonComponents
                                            type="button"
                                            buttonType="btn btn-primary btn-block"
                                            buttonAction={() => { this.submitHandel(); }}
                                            buttonText={loading ? '' : 'Kirim Email'}
                                            buttonIcon={loading && 'fas fa-sync-alt fa-spin'}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </FormValidation>

                            <p
                                className="m-2 text-center" 
                                onClick={() => window.location.href = "#/Login" }
                                style={{ cursor: 'pointer' }}
                            >
                                Kembali Login
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

export default ForgotPassword;
