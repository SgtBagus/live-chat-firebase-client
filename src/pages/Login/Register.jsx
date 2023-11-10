import React, { Component } from "react";
import update from 'immutability-helper';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../../firebase";

import { uploadFile } from "../../data/uploadFile";

import FormValidation from "../../components/FormValidation";
import InputText from "../../components/form/InputText";
import InputEmail from "../../components/form/InputEmail";
import InputPassword from "../../components/form/InputPassword";
import ButonComponents from '../../components/Button';

import { GENERATE_ERROR_MESSAGE, validateEmail } from "../../Helper/error";
import { catchError } from "../../Helper/helper";

import imageDefault from './defaultImage.png';
import 'react-notifications/lib/notifications.css';
import './style.scss';

class Register extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
                name: '',
                email: '',
                password: '',
                repreatPassword: '',
                file: null,
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
        const { form: { file } } = this.state;
        const isFormValid = await this.form.validateForm();

        if (isFormValid) {
            try {
                if (!file) throw new Error('Mohon Upload Foto Anda');

                this.setState({
                    loading: true,
                }, async () => {
                    await this.handleSubmit();
                });
            } catch (err) {
                const errorText = catchError(err);
                this.handleExpectedError(errorText);
            }
        }
    
        this.setState({
          isFormSubmitted: true,
        });
    }

    handleSubmit = async () => {
        const {
            form : {
                name, email, password, file,
            }
        } = this.state;

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            if (!res) throw new Error('Email Tersebut Sudah Terdaftar');

            const date = new Date().getTime();
            const uploadImage = await uploadFile(file, `userProfile/${name.replaceAll(' ', '_') + date}`);
            if (!uploadImage) throw new Error('Foto Tidak Terupload');
            
            await updateProfile(res.user, { displayName: name, photoURL: uploadImage });
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName: name,
                email,
                photoURL: uploadImage,
                is_admin: false,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});

            window.location.href = "/";
        } catch (err) {
            this.setState({
                loading: false,
            }, async () => {
                const errorText = catchError(err);
                this.handleExpectedError(errorText);
            });
        }
    };

    handleExpectedError = (text) => {
        NotificationManager.error(text, 'Terjadi Kesalahan', 5000);
    }

    render() {
        const {
            form: {
                name, email, password, repreatPassword, file,
            },
            loading,
        } = this.state;

        return (
            <div className="loginContiner">
                <div className="login-box">
                    <div
                        className="login-logo" 
                        onClick={() => window.location.href = "/" }
                        style={{ cursor: 'pointer' }}
                    >
                        <b>Admin</b>LTE
                    </div>
                    <div className="card">
                        <div className="card-body login-card-body">
                            <p className="login-box-msg">Daftarkan Diri Anda !</p>

                            <FormValidation ref={(c) => { this.form = c; }}>
                                <div className="d-flex flex-column mb-2">
                                    <InputText
                                        name="namePerson"
                                        placeholder="Nama Anda"
                                        value={name}
                                        changeEvent={(val, e) => this._changeInputHandler('name', val, e)}
                                        required
                                    />
                                    <FieldFeedbacks for="namePerson">
                                        <FieldFeedback when="valueMissing">
                                            {GENERATE_ERROR_MESSAGE('Nama Anda', 'valueMissing')}
                                        </FieldFeedback>
                                    </FieldFeedbacks>
                                </div>
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
                                <div className="d-flex flex-column mb-2">
                                    <InputPassword
                                        placeholder="Ulangi Password Anda"
                                        name="repreatPassword"
                                        changeEvent={(val, e) => this._changeInputHandler('repreatPassword', val, e)}
                                        value={repreatPassword}
                                        required
                                    />
                                    <FieldFeedbacks for="repreatPassword">
                                        <div>
                                            <FieldFeedback when="valueMissing">
                                                {GENERATE_ERROR_MESSAGE('Ulangi Password Anda', 'valueMissing')}
                                            </FieldFeedback>
                                            <FieldFeedback when={val => (val !== password)}>
                                                {GENERATE_ERROR_MESSAGE('Password Anda Tidak Sama', 'valueMissing')}
                                            </FieldFeedback>
                                        </div>
                                    </FieldFeedbacks>
                                </div>
                                <div className="d-flex flex-column mb-2">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={file ? URL.createObjectURL(file) : imageDefault}
                                            className="mr-2"
                                            style={{
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                width: '100px',
                                                height: '100px',
                                            }}
                                            alt="Register User"
                                        />
                                        <div className="ml-2 w-100">
                                            <input
                                                required
                                                style={{ display: "none" }}
                                                type="file"
                                                id="file" 
                                                accept="image/png, image/jpeg, image/jpg"
                                                onChange={(e) => {
                                                    try {
                                                        this._changeInputHandler('file', e.target.files[0], e);
                                                    } catch {
                                                        this._changeInputHandler('file', null, e);
                                                    }
                                                }}
                                            />
                                            <label htmlFor="file" className="w-100" style={{ marginBottom: 'unset' }}>
                                                <div className="btn btn-default btn-block">
                                                    <i className="fas fa-file mx-2" />
                                                    Upload Foto Anda
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <ButonComponents
                                            type="button"
                                            buttonType="btn btn-primary btn-block"
                                            buttonAction={() => { this.submitHandel(); }}
                                            buttonText={loading ? 'Memperoses' : 'Daftar'}
                                            buttonIcon={loading ? 'fas fa-sync-alt fa-spin' : 'fas fa-sign-in-alt'}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </FormValidation>

                            <p
                                className="m-2 text-center" 
                                onClick={() => window.location.href = "/login" }
                                style={{ cursor: 'pointer' }}
                            >
                                Sudah Jadi Pengguna
                            </p>
                        </div>
                    </div>
                </div>
                
                <NotificationContainer />
            </div>
        )
    }
};
export default Register;
