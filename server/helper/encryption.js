import crypto from "crypto";


export function encrypt(text) {
    try{
    console.log(process.env.encryptAlgorithm, process.env.encryptKey,process.env.encryptiv);
  const cipher  = crypto.createCipheriv(process.env.encryptAlgorithm, process.env.encryptKey,process.env.encryptiv);
  console.log(cipher , "cipher");
  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return encrypted;
    }
    catch(err){
        console.log("error in encryption", err);
    }
}

export function decrypt(encryptedText) {
  try{
    console.log("in decryption");
  const decipher = crypto.createDecipheriv(process.env.encryptAlgorithm,process.env.encryptKey,process.env.encryptiv);
  const decrypted = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
  }
  catch(err){
    console.log("error in decryption",err)
  }
}