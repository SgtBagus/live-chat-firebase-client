import { sendEmailVerification } from "firebase/auth";
import { NotificationManager } from 'react-notifications';

import { catchError } from "../Helper/helper";

export const sendEmailVerificationEvent = async (user) => {
    try {
        await sendEmailVerification(user);
        NotificationManager.success('Email Sudah Terkirim', 'Success', 5000);
    } catch (err) {
        NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
    }
}
