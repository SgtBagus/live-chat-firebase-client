import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { NotificationManager } from 'react-notifications';

import { storage } from "../firebase";
import { catchError } from "../Helper/helper";

export const uploadFile = async (file, pathUpload) => {
    const { name } = file;

    try {
        const directionPathFile = `${pathUpload}${name.replaceAll(' ', '_')}`;
        const storageRef = ref(storage, directionPathFile);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        if (!uploadTask) throw new Error ('Upload Mengalami Kegagalan');

        return await getDownloadURL(ref(storage, directionPathFile));
    } catch (err) {
        NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
    }
}