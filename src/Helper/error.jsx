import { isEmail } from 'validator';

export const validateEmail = email => isEmail(email);

export const GENERATE_ERROR_MESSAGE = (key, type) => {
    const errorType = [
        {
            type: 'valueMissing',
            text: `Mohon lengkapi ${key}`,
        },
        {
            type: 'emailInvalid',
            text: 'Format Email Tidak Sesuai',
        },
    ];

    const errorCode = errorType.find(x => x.type === type);
    return errorCode.text;
};