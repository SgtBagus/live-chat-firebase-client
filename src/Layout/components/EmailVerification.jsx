import React, { useState } from "react";

import Callouts from '../../components/Callouts';
import ButonComponents from '../../components/Button';

import { sendEmailVerificationEvent } from '../../data/sendEmailVerification';

export const EmailVerification = ({ dataLogin }) => {
    const [loading, setLoading] = useState(false);

    const sendEmailVerification = async () => {
        setLoading(true);

        await sendEmailVerificationEvent(dataLogin);

        setLoading(false);
    }

    return (
        <div className="row">
            <div className="col-12">
                <Callouts
                    iconAlert="fas fa-envelope"
                    title="Verifikasi Email !"
                    closeAlert={false}
                    type="warning"
                >
                    <div className="d-flex flex-column align-items-start">
                        <div>
                            <p className="mb-2">
                                Untuk menggunakan fitur chat, silakan verifikasi email Anda.
                            </p>
                            <p>
                                Jika email verifikasi tidak muncul, silakan klik tombol
                                <b> Kirim Ulang </b>
                                di bawah ini.
                            </p>
                        </div>

                        <ButonComponents
                            type="button"
                            buttonType="btn btn-primary"
                            buttonAction={sendEmailVerification}
                            buttonText={loading ? 'Memperoses' : 'Kirim Ulang Email Verifikasi'}
                            buttonIcon={loading && "fas fa-sync-alt fa-spin"}
                            disabled={loading}
                        />
                    </div>
                </Callouts>
            </div>
        </div>
    );
};
