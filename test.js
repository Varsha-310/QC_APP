import CryptoJS from 'crypto-js';

export function encrypt(text) {
  try {
    // console.log(process.env.encryptAlgorithm, process.env.encryptKey, process.env.encryptiv);

    const key = CryptoJS.enc.Hex.parse("ExchangePasswordPasswordExchange");
    const iv = CryptoJS.enc.Hex.parse("fb81b45f22466517");

    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    console.log(encrypted.toString())
    return encrypted.toString();

  } catch (err) {
    console.log("error in encryption", err);
  }
}

export function decrypt(encryptedText) {
  try {
    const key = CryptoJS.enc.Hex.parse("ExchangePasswordPasswordExchange");
    const iv = CryptoJS.enc.Hex.parse("fb81b45f22466517");

    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
 console.log(decrypted.toString(CryptoJS.enc.Utf8))
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.log("error in decryption", err);
  }
}


// encrypt("qwertyuiop");
decrypt("HErDNJXadJHR6CU7isY7eA==")