
const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

export const checkThisFileIsImageOrNot = ({ type }) => {
    if (validImageTypes.find((val) => val === type)) {
        return true;
    } else {
        return false;
    }
}


const getFileExtension = (fileName) => fileName.replace(/^.*\./, '');

const isIMage = (fileName) => {
    const fileExt = getFileExtension(fileName);
    const imagesExtension = ["png", "jpg", "jpeg"];

    if(imagesExtension.indexOf(fileExt) !== -1){
        return true;
    } else{
        return false;
    }
}

export const checkfileUrl = (urlFile) => {
    const url = new URL(urlFile);
    const fileName = url.pathname.split('/').slice(-1)[0];

    return isIMage(fileName);
} 