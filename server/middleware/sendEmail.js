import NodeMailer from "nodemailer";
import email_template from "../views/email_template.js";

export const sendEmailViaSendGrid = async (
  giftCardDetails,
  order,
  shopName,
  email_id,
  message,
  receiver
) => {;
console.log("in the mail sender");

var mail_id = "helpdesk@qwikcilver.com";
var subject = "Your Qwikcilver GiftCard is ready to use!";

console.log(email_id);
// email_template = email_template.replace(
//   "__CardNumber__",
//   giftCardDetails["CardNumber"]
// );
// email_template = email_template.replace(
//   "__CardPIN__",
//   giftCardDetails["CardPIN"]
// );
// email_template = email_template.replace(
//   "__Amount__",
//   giftCardDetails["Amount"]
// );
// email_template = email_template.replace(
//   "__Expiry__",
//   getReadableDate(giftCardDetails["CardExpiry"])
// );
// Framing the mail options
const options = {
  to: email_id,
  from: mail_id,
  subject: subject,
  html: email_template,
};
console.log(options);

var smtpTransporter = NodeMailer.createTransport({
  port: 587,
  host: "smtp.sendgrid.net",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// console.log(options);
smtpTransporter.sendMail(options, async function (error, info) {
  if (!error) {
    console.log("mail sent successfully !");
    // Resolve if the mail is sent successfully
    
  } else {
    console.log(error);
  
  }
})
};
