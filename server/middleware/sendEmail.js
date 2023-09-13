import NodeMailer from "nodemailer";
import template from "../views/email_template.js";

//Function to convert the Javascript Date Object to a readable format
function getReadableDate(dateObj) {
  var d = new Date(dateObj),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return `${day}-${month}-${year}`;
}

/**
 * to create payload for sending gc emails to customers
 * @param {*} shopName 
 * @param {*} giftCardDetails 
 * @param {*} receiver 
 * @param {*} email_id 
 * @param {*} message 
 * @param {*} image_url 
 * @returns 
 */
export const sendEmailViaSendGrid = async (
  shopName,
  giftCardDetails,
  receiver,
  email_id,
  message,
  image_url
) => {;
console.log("in the mail sender");

var mail_id = "GC@qwikcilver.com";
var subject = "Your Qwikcilver GiftCard is ready to use!";
console.log("----------", giftCardDetails);
let email_template = template;
email_template = email_template.replace(
  "__CardPIN__",
  giftCardDetails["CardPin"]
);
email_template = email_template.replace(
  "__CardNumber__",
  giftCardDetails["CardNumber"]
);
email_template = email_template.replace(
  "__Amount__",
  giftCardDetails["Balance"]
);
email_template = email_template.replace(
  "__Expiry__",
  getReadableDate(giftCardDetails["ExpiryDate"])
);
email_template = email_template.replace(
  "__receiver__", receiver
);
email_template = email_template.replace(
  "__message__", message
);
email_template = email_template.replace(
  "template_image", image_url
);
email_template = email_template.replaceAll( __domain__*
  "__store__", `https://${shopName}`
);
email_template = email_template.replaceAll( 
  "__domain__", `${shopName}`
);



// Framing the mail options
const options = {
  to: email_id,
  from: mail_id,
  subject: subject,
  html: email_template,
};
console.log(options);
await sendEmail(options);
return true;
};


/**
 * method to email through sendGrid
 * @param {*} options 
 */
export const sendEmail = (options) => {
  var smtpTransporter = NodeMailer.createTransport({
    port: 587,
    host: "smtp.sendgrid.net",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
  console.log(options , "email options for sendgrid");
  smtpTransporter.sendMail(options, async function (error, info) {
    if (!error) {
      console.log("mail sent successfully !");
      // Resolve if the mail is sent successfully
      
    } else {
      console.log(error);
    
    }
  })

}
