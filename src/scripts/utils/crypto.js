const CryptoJS = require("crypto-js");
const {HASH_SECRET_KEY:secretKey,HASH_IV:iv,HASH_SALT:salt} = process.env;

function decrypt(hash) {
    const secretKeyParse = CryptoJS.enc.Hex.parse(secretKey);
    const key = CryptoJS.PBKDF2(secretKeyParse, salt, { keySize: 32 });
    const parseIV = CryptoJS.enc.Hex.parse(iv);
    const ciphertext = CryptoJS.enc.Base64.parse(hash);
    const decrypted = CryptoJS.AES.decrypt({ciphertext: ciphertext}, key, { iv: parseIV });
    return decrypted.toString(CryptoJS.enc.Utf8)
  }
  function encrypt(text) {
    const secretKeyParse = CryptoJS.enc.Hex.parse(secretKey);
    const key = CryptoJS.PBKDF2(secretKeyParse, salt, { keySize: 32 });
    const parseIV = CryptoJS.enc.Hex.parse(iv);
    const cipher = CryptoJS.AES.encrypt(text, key, { iv: parseIV });
    return cipher.toString();
  }

  module.exports={decrypt,encrypt}