const testImage = async (url, timeout) => {
    let timedOut = false, timer;
    const img = new Image();

    timeout = timeout || 5000;

    let imageResult = 'false';

    img.onerror = img.onabort = () => {
        if (!timedOut) {
            clearTimeout(timer);
            imageResult = 'error';
        }
    };
    img.onload = () => {
        if (!timedOut) {
            clearTimeout(timer);
            imageResult = 'success';
        }
    };
    img.src = url;
    timer = setTimeout(() =>{
        timedOut = true;
        img.src = "//!!!!/test.jpg";
        imageResult = 'timeout';
    }, timeout); 

    return imageResult;
}

export const checkImage = async (inputUrl) => {
    const httpsReference = FirebaseStorage.getInstance().getReferenceFromUrl(inputUrl)

    console.e
}