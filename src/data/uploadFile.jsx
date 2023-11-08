import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { storage } from "../firebase";

export const uploadFile = async (file, pathUpload) => {
    const { name } = file;

    try {
        const directionPathFile = `${pathUpload}${name.replaceAll(' ', '_')}`;
        const storageRef = ref(storage, directionPathFile);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        if (!uploadTask) throw new Error ('Upload Mengalami Kegagalan');

        return await getDownloadURL(ref(storage, directionPathFile));
    } catch (err) {
        alert(err);
    }
}