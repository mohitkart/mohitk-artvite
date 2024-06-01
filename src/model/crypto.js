var CryptoJS = require("crypto-js");
const secretkey='mohIt123#%'

const encrypt=(str)=>{
    var ciphertext = CryptoJS.AES.encrypt(str, secretkey).toString();
    return ciphertext
}


const decrypt=(ciphertext)=>{
    var bytes  = CryptoJS.AES.decrypt(ciphertext, secretkey);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
}


const cryptoModel={encrypt,decrypt}
export default cryptoModel