import mongoose from "mongoose";
import CryptoJS from "crypto-js";

/*Scheme for storing qc_credentials */
const qc_credentials = mongoose.Schema({
  store_url: String,
  shopify_id: String,
  username: String,
  password: String,
  terminal_id: String,
  date_at_client: String,
  giftcard_cpgn: String,
  refund_cpgn: String,
  wpgn: String,
  unique_transaction_id: {type : Number , default : 0},
  token :String,
  oracle_id : String
});

/**
 * pre hook to encrypt data befor storing DB
 */
qc_credentials.pre("updateOne", function (next) {
  console.log("in pre hook")
  const secretKey = process.env.ENCRYPT_KEY;
  const encryptedPassword = CryptoJS.AES.encrypt(this.password, secretKey).toString();
  const encryptedUsername = CryptoJS.AES.encrypt(this.username, secretKey).toString();
  console.log(this.password , this.username ,encryptedPassword,encryptedUsername)

  this.password = encryptedPassword;
  this.username = encryptedUsername;

  next();
});

/**
 * post hook to decrypt data while fetching from DB
 */
qc_credentials.post("findOne", function (docs) {
  const documents = Array.isArray(docs) ? docs : [docs];

  documents.forEach((doc) => {
    const secretKey = process.env.ENCRYPT_KEY;

    const decryptedBytesOfPassword = CryptoJS.AES.decrypt(doc.password, secretKey);
    const decryptedBytesOfUsername = CryptoJS.AES.decrypt(doc.username, secretKey);

    const decryptedPassword = decryptedBytesOfPassword.toString(CryptoJS.enc.Utf8);
    const decryptedUsername = decryptedBytesOfUsername.toString(CryptoJS.enc.Utf8);

    doc.password = decryptedPassword;
    doc.username = decryptedUsername
  });
});

export default mongoose.model("qc_credentials", qc_credentials);
